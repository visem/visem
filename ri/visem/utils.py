
def is_inside(point, room):
	### Returns true if a given point is inside of a given room.
	if(((point.x >= room.initialPoint.x) and (point.x <= room.finalPoint.x)) and 
	   ((point.y >= room.initialPoint.y) and (point.y <= room.finalPoint.y))):
	        return True
	return False

def count_people(people, room):
    ### Returns the count of people inside a room.
    pass
    
#if __name__ == "__main__"