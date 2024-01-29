import random

file = open("test.txt", 'w')

p = int(12)

for i in range(p):
    file.write(str(random.randint(26, 60)/100))
    if i != p-1:
        file.write(", ")
file.close()