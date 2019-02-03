import sqlite3

def connect():
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,name text,username text,email text,dob text, password text)")
    conn.commit()
    conn.close()

def insert(name,username,email,dob,password):
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("INSERT INTO users VALUES (null,?,?,?,?,?)",(name,username,email,dob,password))
    conn.commit()
    conn.close()


def view():
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("SELECT * FROM users")
    rows=cur.fetchall()
    conn.close()
    return rows

def search1(username=""):
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=?", (username,))
    rows=cur.fetchall()
    conn.close()
    return rows

def search(username="",password=""):
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=? AND password=? ", (username,password))
    rows=cur.fetchall()
    conn.close()
    return rows

def delete(id):
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("DELETE FROM users WHERE id=?",(id,))
    conn.commit()
    conn.close()

def update(id,name,username,email,dob,password):
    conn=sqlite3.connect("users.db")
    cur=conn.cursor()
    cur.execute("UPDATE users SET name=?, username=?, email=?, dob=? WHERE id=?",(name,username,email,dob,id))
    conn.commit()
    conn.close()

connect()
#print(view())
#print(search1("prathamzx"))
#delete(3)
#update(4,"The moon","John Smooth",1917,99999)
#print(view())
#print(search(name="John Smooth"))
