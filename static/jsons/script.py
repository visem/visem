#!/usr/bin/python
import random


list = "[\n"
num = 0

for i in range(1,50):
    list = list + str("\t{\n"
    +"\t\t\"idPerson\":"+ str(i) +",\n"
    +"\t\t\"positionX\":"+ str("{0:.1f}".format(random.random()*15)) +",\n"
    +"\t\t\"positionY\":"+ str("{0:.1f}".format(random.random()*9)) +",\n"
    +"\t\t\"stationary\":"+ str("true" if i%2 == 0 else "false") +",\n"
    +"\t\t\"age\":"+ str(int(random.random()*100)) +",\n"
    +"\t\t\"disability\":"+ str("1" if i%2 == 0 else "0") +"\n"
    +"\t}")
    
    if(i+1 != 50):
    	list = list + str(",\n")


list = list + "\n]"
file = open("people2.json","w+")
file.write(list)
file.close()

