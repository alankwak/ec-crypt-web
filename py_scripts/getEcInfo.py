import sys
import os
print("Current working dir:", os.getcwd())
print("This file's dir:", os.path.dirname(os.path.abspath(__file__)))
print("Files here:", os.listdir(os.path.dirname(__file__)))
sys.path.append(os.path.dirname(__file__))

from elliptic_curves_v2 import ecCayleyTable, ecLetterKey
import json

a = int(sys.argv[1])
b = int(sys.argv[2])
mod = int(sys.argv[3])
toEncrypt = sys.argv[4]
toDecrypt = sys.argv[5]

def x_func(x):
    return x**3 + a*x + b

ct = ecCayleyTable(x_func, mod, a=a)
ec = ecLetterKey(ct)

encrypted_message = None
decrypted_message = None

if toEncrypt:
    encrypted_message = ec.encrypt(toEncrypt)
elif toDecrypt:
    decrypted_message = ec.decrypt(toDecrypt)

print(json.dumps({'cthead': ct.pts, 
                  'ctbody': ct.table, 
                  'echead': ec.letters, 
                  'ecbody': ec.key,
                  'encrypted': encrypted_message,
                  'decrypted': decrypted_message}))


sys.stdout.flush()