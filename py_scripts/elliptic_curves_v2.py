## Elliptic Curve Cryptology Program ##

## -- Crude Testing Functions
# def isUnique(pts):
#     for p in pts:
#         if pts.count(p) > 1:
#             return False
#     return True

# def testTable(table):
#     for i in range(len(table[0])):
#         pts2 = [table[j][i] for j in range(len(table[0]))]
#         if not isUnique(table[i]):
#             return i + 1
#         if not isUnique(pts2):
#             return -(i - 1)
#     return 0

class ecCayleyTable:
    ## ------------------------------- Initialization ------------------------------- ##

    def __init__(self, x_func, mod, a=None):
        self.pts = self.findPts(x_func, mod)
        self.mod = mod
        if a is None:
            a = int((x_func(1e-3) - x_func(-1e-3))/2e-3+.5)
            self.a = int((x_func(1e-3) - x_func(-1e-3))/2e-3+.5) if a > 0 else int((x_func(1e-3) - x_func(-1e-3))/2e-3-.5)
        else: self.a = a
        self.table = self.createCayleyTable()
        
    def createCayleyTable(self):
        table = [[None]*len(self.pts) for i in range(len(self.pts))]

        for i in range(len(self.pts)):
            pt = self.pts[i]
            pt3 = self.combinePts(pt, pt)
            table[i][i] = pt3

            opp = self.oppositePt(pt3)
            j = self.pts.index(opp)
            pt3 = self.oppositePt(pt)
            table[i][j] = pt3
            table[j][i] = pt3

        for i in range(len(self.pts)):
            for j in range(i+1, len(self.pts)):
                if table[i][j] is None:
                    pt3 = self.combinePts(self.pts[i], self.pts[j])
                    table[i][j] = pt3
                    table[j][i] = pt3

        return table

    ## ---------------- Helper Functions for Abstract Algebra and Setup ---------------- ##

    # Use to find all points on an modular elliptic curve
    def findPts(self, x_func, mod):
        y_vals = [(i**2) % mod for i in range(mod)]
        x_vals = [x_func(i) % mod for i in range(mod)]
        pts = []
        for i in range(mod):
            for j in range(mod):
                if y_vals[j] == x_vals[i]:
                    pts.append([i, j])
        pts.append("inf")
        return pts
    
    # Use to find C
    def findThirdPt(self, pt1, pt2, show_steps=False):
        import copy

        if pt1 not in self.pts or pt2 not in self.pts:
            raise Exception("One or both points not in the list of all points")

        if pt1 == 'inf' and pt2 == 'inf':
            return 'inf'
        elif pt1 == "inf":
            curr_pt = copy.deepcopy(pt2)
            curr_pt[1] = (curr_pt[1] * -1) % self.mod
            return curr_pt
        elif pt2 == "inf":
            curr_pt = copy.deepcopy(pt1)
            curr_pt[1] = (curr_pt[1] * -1) % self.mod
            return curr_pt

        if pt2[0] < pt1[0]:
            temp = pt1
            pt1 = pt2
            pt2 = temp
        
        changeX = pt2[0] - pt1[0]
        if changeX == 0 and (pt2 != pt1 or pt1[1] == 0): 
            return "inf"
        elif pt1 == pt2:
            inverse = 0
            for i in range(1, self.mod+1):
                if (i * 2 * pt1[1]) % self.mod == 1:
                    inverse = i
                    break
            changeY = ((3*pt1[0]**2 + self.a) * inverse) % self.mod
            changeX = 1
        else:
            changeY = pt2[1] - pt1[1]
        curr_pt = copy.deepcopy(pt2)
        
        curr_pt[0] = (curr_pt[0] + changeX) % self.mod
        curr_pt[1] = (curr_pt[1] + changeY) % self.mod
        while curr_pt not in self.pts:
            if show_steps: print(curr_pt)
            curr_pt[0] = (curr_pt[0] + changeX) % self.mod
            curr_pt[1] = (curr_pt[1] + changeY) % self.mod
        if show_steps: print(curr_pt)
        return curr_pt
    
    # Easily get -A from A
    def oppositePt(self, pt):
        if(pt == 'inf'): return 'inf'
        import copy
        op = copy.deepcopy(pt)
        op[1] = (op[1] * -1) % self.mod
        return op

    # Use for answer to A * B = -C
    def combinePts(self, pt1, pt2):
        ans = self.findThirdPt(pt1, pt2)
        if ans == 'inf': return 'inf'
        return self.oppositePt(ans)


    # # Output the Cayley Table in string format (for printing)
    # def __str__(self):
    #     ret = f"Cayley Table:\n{9*' '}"
    #     for p in self.pts:
    #         n = 8 - len(str(p))
    #         ret = ret + f'| {p} {n*' '}'
    #     ret = ret + f'\n{11*(len(self.pts)+1)*'-'}\n'
    #     for i in range(len(self.pts)):
    #         n = 8 - len(str(self.pts[i]))
    #         ret = ret + f'{self.pts[i]} {n*' '}'
    #         for p in self.table[i]:
    #             n2 = 8 - len(str(p))
    #             ret = ret + f'| {p} {n2*' '}'
    #         ret = ret + f'\n{11*(len(self.pts)+1)*'-'}\n'
    #     return ret

class ecLetterKey:
    def __init__(self, ct: ecCayleyTable):
        self.conversion = self.getConversion(ct.pts)
        self.letters = [self.conversion[ct.pts.index(pt)] for pt in ct.pts]
        self.key = [[self.conversion[ct.pts.index(pt)] for pt in ct.table[i]] for i in range(len(self.letters))]
        self.generateCombos()

    # creates a map from elliptic curve points to alphabetic characters
    def getConversion(self, pts):
        conversion = {}
        for i in range(len(pts)-1):
            val = chr(65 + pts[i][0]*2 + i % 2)
            conversion[i] = val
        conversion[pts.index('inf')] = ' '
        return conversion
    
    # creates a dictionary mapping each letter to all the possible combinations that result in that letter
    def generateCombos(self):
        self.combos = {}
        for l in self.letters:
            self.combos[l] = []
            
        for i in range(len(self.letters)-1):
            for j in range(len(self.letters)-1):
                self.combos[self.key[i][j]].append((self.letters[i], self.letters[j]))

    def encrypt(self, message):
        import random
        
        ec_message = ''
        message = message.upper()

        for c in message:
            options = self.combos.get(c)
            if options is not None and len(options) != 0:
                rand_c = random.randint(0, len(self.combos.get(c))-1)

                for l in self.combos[c][rand_c]:
                    ec_message += l
            else:
                ec_message += c

        return ec_message

    def decrypt(self, ec_message):
        message = ''
        i = 0
        while i < len(ec_message):
            l1 = ec_message[i] if ec_message[i] in self.letters else ' '
            
            if l1 == ' ':
                message += ec_message[i]
            else:
                l2 = ec_message[i+1] if ec_message[i+1] in self.letters else ' '
                if l2 != ' ':
                    message += self.key[self.letters.index(l1)][self.letters.index(l2)]
                    i += 1
                else:
                    message += ec_message[i]
            i += 1
        return message

    # # Output the combination key in string format (for printing)
    # def __str__(self):
    #     ret = f'Letter key:\n{9*' '}'
    #     for p in self.letters:
    #         n = 8 - len(str(p))
    #         ret = ret + f'| {p} {n*' '}'
    #     ret = ret + f'\n{11*(len(self.letters)+1)*'-'}\n'
    #     for i in range(len(self.letters)):
    #         n = 8 - len(str(self.letters[i]))
    #         ret = ret + f'{self.letters[i]} {n*' '}'
    #         for p in self.key[i]:
    #             p = '\'' + p + '\''
    #             n2 = 8 - len(str(p))
    #             ret = ret + f'| {p} {n2*' '}'
    #         ret = ret + f'\n{11*(len(self.letters)+1)*'-'}\n'
    #     return ret
    
def isPrime(num: int):
  if num < 2:
    return False
  for i in range(2, int(num**(1/2))+1):
    if num % i == 0:
      return False
  return True

def promptUserOptions():
    print('\t1    - Encrypt your own message.')
    print('\t2    - Decrypt a coded message.')
    print('\t3    - Print the cryptology key.')
    print('\t4    - Print information about the elliptic curve group.')
    print('\texit - Stop the program.')

def main():
    print('Elliptic Curve Cryptology Program\n')
    mod = int(input('Enter the *prime* modulus you want to use (13 is optimal for cryptology): '))
    while not isPrime(mod):
        mod = int(input('Not prime. Enter the *prime* modulus you want to use (13 is optimal for cryptology): '))
    
    print(f'Input parameters for the elliptic curve key:\n(of the form x^3 + ax + b, where (4a^3 + 27b^2) mod {mod} != 0 and a and b are integers)')
    a = int(input('\ta = '))
    b = int(input('\tb = '))
    while (4*a**3 + 27*b**2) % mod == 0:
        print(f'Input does not satisfy (4a^3 + 27b^2) mod {mod} != 0. Please enter other values:')
        a = int(input('\ta = '))
        b = int(input('\tb = '))
    
    def x_func(x):
        return x**3 + a*x + b
    
    ct = ecCayleyTable(x_func, mod)
    ec = ecLetterKey(ct)

    print('Success. What would you like to do?')
    promptUserOptions()
    c = input('')
    
    while c.lower() != 'exit':
        match c:
            case '1':
                m = input('Enter your message: ')
                e = ec.encrypt(m)
                print(f'Your encrypted message is:\n\t{e}')
            case '2':
                m = input('Enter your encoded message: ')
                s = ec.decrypt(m)
                print(f'Your secret message is:\n\t{s}')
            case '3':
                print(ec)
            case '4':
                print(f'Points: {ct.pts}')
                print(ct)

        print('What would you like to do?')
        promptUserOptions()
        c = input('')
    
if __name__ == "__main__":
    main()
