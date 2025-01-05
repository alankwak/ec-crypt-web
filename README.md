# ec-crypt

## Alert: I found a bug where the program calculates the wrong point when combining two points. While you can still generate secret codes using the program, they are only decipherable using this program because the key is wrong. I have an idea on how to fix this.

In my abstract algebra course, we did some work with elliptic curves and the groups they create under modular arithmetic. This program uses these groups to encode and decode messages.

The program will ask for two values to create a key, and then allow you to input a message to either encode or decode using the key.

![image](https://github.com/user-attachments/assets/34b379b9-f1e6-41f3-afeb-bd4aff899615)

## Abstract algebra, for those who are interested
The elements of elliptic curve groups are the points that satisfy an elliptic equation, i.e. the points that satisfy

$y^2 \equiv x^3 + ax + b \pmod{n}$ 

for some $a, \ b$, such that $4a^3 + 27b^2 \neq 0$. There is also an identity element $\infty$.

The group operation is defined by $A \cdot B = -C$, where $C$ is the third point on the elliptic curve that also lies on the line drawn through $A$ and $B$. If no such point exists, we define $C$ to be $\infty$. The point $-C$ is the point obtained by reflecting $C$ over the x-axis.

We can assign every point a letter value, and then combine letters together using this operation to obtain a new letter. The cipher works by combining every two letters in the encrcypted message to output the decrypted message. There are multiple ways to combine letters to get a given letter, so it is possible to obtain different encrypted messages that for a single decrypted message. When encrypting, the program chooses the pairing it will use randomly.

In addition, it is worth noting that not all letters will be defined by a point on the elliptic curve. In this case, the encrypted message contains a pairing of "junk characters," where the first is the letter that is used in the decoded message. Even when it is possible for a letter to be represented by a point, there is a chance the program will choose this method instead.
