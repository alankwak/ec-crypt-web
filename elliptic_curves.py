# Use to find all points on an modular elliptic curve
def findPts(mod, x_func):
    y_vals = [(i**2) % mod for i in range(mod)]
    x_vals = [x_func(i) % mod for i in range(mod)]
    pts = []
    for i in range(mod):
        for j in range(mod):
            if y_vals[j] == x_vals[i]:
                pts.append([i, j])
    pts.append("inf")
    return pts;

# Use to find C
def findThirdPt(pt1, pt2, mod, pts, show_steps=False):
    import copy
    if pt1 == "inf":
        curr_pt = copy.deepcopy(pt2)
        curr_pt[1] = (curr_pt[1] * -1) % mod
        return curr_pt
    elif pt2 == "inf":
        curr_pt = copy.deepcopy(pt1)
        curr_pt[1] = (curr_pt[1] * -1) % mod
        return curr_pt

    if pt2[0] < pt1[0]:
        temp = pt1
        pt1 = pt2
        pt2 = temp
    
    changeX = (pt2[0] - pt1[0])
    if changeX == 0: return "inf"
    changeY = (pt2[1] - pt1[1])
    curr_pt = copy.deepcopy(pt2);
    curr_pt[0] = (curr_pt[0] + changeX) % mod
    curr_pt[1] = (curr_pt[1] + changeY) % mod
    while curr_pt not in pts:
        if show_steps: print(curr_pt)
        curr_pt[0] = (curr_pt[0] + changeX) % mod
        curr_pt[1] = (curr_pt[1] + changeY) % mod
    if show_steps: print(curr_pt)
    return curr_pt

# Use for answer to A * B = -C
def combinePts(pt1, pt2, mod, pts):
    ans = findThirdPt(pt1, pt2, mod, pts)
    if ans == 'inf': return 'inf'
    ans[1] = (ans[1] * -1) % mod
    return ans

##-------------------------------

# Define relationship between points and letters
def getKey(pts):
    pts.remove('inf')
    pts.sort(key=lambda x: (x[0], x[1]))
    conversion = {'inf' : 'inf'}
    for i in range(len(pts)):
        key = chr(65 + pts[i][0]*2 + i % 2)
        conversion[key] = pts[i]
    pts.append('inf')
    return conversion

# Use to decrypt messages using a key
def decrypt(message, key):
    pts = [v for v in key.values()]

    # combine letters to get points
    pt_message = []
    secret_message = ''
    for i in range(0, len(message)-1, 2):
        if key.get(message[i]) is not None:
            key1 = message[i]
        else: key1 = 'inf'
        if key.get(message[i+1]) is not None:
            key2 = message[i+1]
        else: key2 = 'inf'
        if key1 == 'inf' and key2 == 'inf':
            pt_message.append(message[i]);
        else:
            pt_message.append(combinePts(key[key1], key[key2], 13, pts))

    # convert points to letters and add to output
    for pt in pt_message:
        added = False
        for k, v in key.items():
            if v == pt:
                if k == 'inf':
                    secret_message += ' '
                else:
                    secret_message += k
                added = True
                break
        if not added:
            secret_message += pt
    return secret_message

# Use to encrypt your own messages using a key
def encrypt(message, key):
    import random
    message = message.upper()
    pts = [v for v in key.values()]
    
    # define point->letter map for easier lookup
    reverse_key = {}
    for k, v in key.items():
        reverse_key[pts.index(v)] = k

    # find all possible letter combinations and their values
    letter_combos = {}
    for i in range(len(pts)):
        for j in range(i+1, len(pts)):
            possible_letter = reverse_key[pts.index(combinePts(pts[i], pts[j], 13, pts))]
            if letter_combos.get(possible_letter) is None:
                letter_combos[possible_letter] = []
            letter_combos[possible_letter].append((reverse_key[i], reverse_key[j]))

    # Find "junk" characters for use when char we want to encrypt is not part of the combinations
    junk_chars = []
    for i in range(65, 126):
        if letter_combos.get(chr(i)) is None:
            junk_chars.append(chr(i))

    # create encrypted message
    encrypted_message = []
    for i in range(len(message)):
        letter = message[i]

        # space is represented as 'inf' in letter combos
        if letter == ' ': 
            letter = 'inf'

        # if letter pairing exists, choose a random one, otherwise use letter + a junk character
        if letter_combos.get(letter) is not None:
            rand_c = random.randint(0, len(letter_combos.get(letter))-1)

            # also possible to use letter + junk char combo if pairing exists
            if letter_combos[letter][rand_c][0] == 'inf':
                encrypted_message.append(letter + junk_chars[random.randint(0, len(junk_chars)-1)])
                continue
            
            if(random.random() > .5):
                encrypted_message.append(letter_combos[letter][rand_c][0] + letter_combos[letter][rand_c][1])
            else: 
                encrypted_message.append(letter_combos[letter][rand_c][1] + letter_combos[letter][rand_c][0])
        else:
            encrypted_message.append(letter + junk_chars[random.randint(0, len(junk_chars)-1)])
    
    return "".join(encrypted_message)

def promptUserOptions():
    print('\t1 - Encrypt your own message.')
    print('\t2 - Decrypt a coded message.')
    print('\t3 - Print the group elements of the elliptic curve.')
    print('\t4 - Stop the program.')

def main():
    print('Elliptic Curve Cryptology Program\n\nInput parameters for the elliptic curve key:\n(of the form x^3 + ax + b, where 4a^3 + 27b^2 != 0)')
    a = int(input('\ta = '))
    b = int(input('\tb = '))
    while 4*a**3 + 27*b**2 == 0:
        print('Input does not satisfy 4a^3 + 27b^2 != 0. Please enter other values:')
        a = int(input('\ta = '))
        b = int(input('\tb = '))
    
    def x_func(x):
        return x**3 + a*x + b
    
    pts = findPts(13, x_func)
    key = getKey(pts)
    
    print('Success. What would you like to do?')
    promptUserOptions()
    c = int(input(''))
    while c > 4 or c < 1:
        print('Invalid input.')
        c = int(input(''))
    
    while c != 4:
        if c == 1:
            m = input('Enter your message:')
            e = encrypt(m, key)
            print(f'Your encrypted message is:\n\t{e}')
        elif c == 2:
            m = input('Enter your encoded message:')
            s = decrypt(m, key)
            print(f'Your secret message is:\n\t{s}')
        elif c == 3:
            print(f'Points: {pts}')

        print('What would you like to do?')
        promptUserOptions()
        c = int(input(''))
        while c > 4 or c < 1:
            print('Invalid input.')
            c = int(input(''))
    
if __name__ == "__main__":
    main()