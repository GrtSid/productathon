from flask import Flask, render_template, redirect, url_for, request,session
import pymongo
#from train import *
import json
file=json.load(open('crop.json'))
myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["mydatabase"]
mycol = mydb["users"]
app=Flask(__name__)

app.secret_key = 'dljsaklqk24e21cjn!Ew@@dsa5'
#randomly generated
@app.route('/', methods=['GET', 'POST'])
def home():
    if not session.get('username')==True:
        return redirect(url_for('login'))

    error = None
    return render_template('test_map.html', error=error)
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    session['predict']=""
    session['state']=[]

    if not session.get('username')==True:
        return redirect(url_for('login'))
    x=dataset(request.form['area'])
    for y in x:
        session['predict']=y
    session['predict']= session['predict']/1000
    session['predict']=round(session['predict'],2)
    s=request.form['stt']
    t=file[s]
    i=0
    for u in t:
        i=i+1
        session['state'].append(u)
        if i==5:
            break

    #user=json.load(open('loc.json'))
    print(user)
    session['location']="[{lat:35.6442877,lng:139.6990956},{lat:35.743341,lng:139.679521},{lat:35.7073985,lng:139.6638354},{lat:35.7812079,lng:139.6057934},{lat:35.7074693,lng:139.9589668}]"

    print(session['state'])
    error = None

    return render_template('test_map.html', error=error)


@app.route('/login', methods=['GET', 'POST'])
def login():

    row=[]
    error = None
    if request.method == 'POST':
        x=mycol.find({'username':request.form['username'],'password':request.form['password']},{'username':1,'password':1})
        for y in x:
            row.append(y)
        if not row:
            error = 'Invalid Credentials. Please try again.'
        else:
            session['username'] = True
            session['user'] = request.form['username']
            return redirect(url_for('home'))
    return render_template('login.html', error=error)


@app.route('/register', methods=['GET', 'POST'])
def register():
    row=[]
    error = None
    if request.method == 'POST':
        if request.form['password'] != request.form["cpassword"]:
            error = 'Passwords do not match!'
        x=mycol.find({'username':request.form['username']},{'username':1})
        for y in x:
            row.append(y)
        if row:
            error='username exists!'

        else:
            mycol.insert_one({'name':request.form['name'],'username':request.form['username'],'email':request.form['email'],'dob':request.form['dob'],'password':request.form['password']})
            return redirect(url_for('login'))

    return render_template('register.html', error=error)

@app.route('/signout', methods=['GET', 'POST'])
def signout():
    session.pop('username')
    session['predict']=""
    return redirect(url_for('login'))


if __name__=="__main__":
    app.run(debug=True)
