import random

file = open("test.txt", 'w')

p = int(24)

for i in range(p):
    file.write(str(random.randint(44000, 46000)))
    if i != p-1:
        file.write(", ")
file.close()