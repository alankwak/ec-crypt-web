## UPDATE: Now on web!
I've released a web app where you can use this program! Head over to [ec-crypt.alankwak.dev](https://ec-crypt.alankwak.dev) and let me know what you think. If you want to use the program on your own machine, make sure to un-comment the ```__str__``` methods for ```ecCayleyTable``` and ```ecLetterKey``` (apparently the f-string formatting I used doesn't work on the older version of Python that is on the server I am using, which is fine because I don't need to print the tables on the website).

# ec-crypt

In my abstract algebra course, we did some work with elliptic curves and the groups they create under modular arithmetic. This program uses these groups to encode and decode messages.

The program will ask for two values to create a key, and then allow you to input a message to either encode or decode using the key. You can also print the key or relevant information about the elliptic curve group.

![image](https://github.com/user-attachments/assets/a492a2cb-710d-4016-a3af-6937330aac16)

![image](https://github.com/user-attachments/assets/400f6610-99dd-4637-8be8-9c3d118c18b5)


## Abstract algebra, for those who are interested
The elements of elliptic curve groups are the points that satisfy an elliptic equation, i.e. the points that satisfy

$y^2 \equiv x^3 + ax + b \pmod{n}$ 

for some $a, \ b$, such that $4a^3 + 27b^2 \pmod{n} \neq 0$. There is also an identity element $\infty$.

The group operation is defined by $A \cdot B = -C$, where $C$ is the third point on the elliptic curve that also lies on the line drawn through $A$ and $B$. If no such point exists, we define $C$ to be $\infty$. The point $-C$ is the point obtained by reflecting $C$ over the x-axis.

We can assign every point a letter value, and then combine letters together using this operation to obtain a new letter. The encryption works by checking if the current letter can be represented by a combination of two letters from the key. If it can, then it is converted to this combination, and if it cannot, then it is left as it is. There are multiple ways to combine letters to get a given letter, so it is possible to obtain different encrypted messages for a single decrypted message. When encrypting, the program chooses the pairing it will use randomly.

To decrypt a message is fairly straightforward: again, we can check if a letter is representable in the key. If it is, then we check the next letter and combine the two using the key, and if it isn't, then we leave it as it is and move to the next letter. 

As you use the program, you might notice that you sometimes get messages where some of the original text does not appear to be encrypted. You probably have an elliptic curve group with very few elements, and therefore very few letters in the alphabet that are encodable. If you're having trouble finding a large elliptic curve group to use under mod 13, try $a=1$ and $b=0$.

Other best practices when using the encryption system (though the program should still work if you ignore these):
- use mod 13
- only use alphabetic characters (A-Z), case does not matter
