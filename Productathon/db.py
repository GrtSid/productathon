import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["mydatabase"]
mycol = mydb["users"]
#mycol.insert_one({'username':'prathamzx','name':'prathamz'})

#x = mycol.insert_one(mydict)
x=mycol.find({'name':'prathamzx'},{'name':1,'username':1})
print(x)
