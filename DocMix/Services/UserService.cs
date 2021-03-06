﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Models;
using MongoDB.Driver;
using DocMix.DTOs;
using MongoDB.Bson;

namespace DocMix.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Doc> _docs;
        private readonly IMongoCollection<Page> _pages;

        public UserService(IDocMixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<User>("Users");
            _docs = database.GetCollection<Doc>("Docs");
            _pages = database.GetCollection<Page>("Pages");
        }

        public List<User> Get()
        {
            List<User> users = _users.Find(u => true).ToList();
            return users;
        }
            

        public User GetUserFull(string id)
        {
            User usr = _users.Find(u => u.ID == id).FirstOrDefault();
            return usr;
        }

        public User Get(string id)
        {
            User usr = _users.Find(u => u.ID == id).FirstOrDefault();
            List<MyDoc> docs = usr.MyDocs;
            usr.MyDocs = docs.Where(md => md.Public  == true).ToList();
            return usr;
        }

        public List<User> GetUsersFiltered(UserFiltersDTO filters)
        {
            List<User> users = _users.Find(u => true).ToList();

            if (filters.Name!="")
                users = users.Where(u => u.Name == filters.Name).ToList();
            if (filters.Country!="")
                users = users.Where(u => u.Country == filters.Country).ToList();

            return users;
        }

        public User Create(User user)
        {
            User usr = _users.Find(u => u.Username == user.Username).FirstOrDefault();
            if(usr==null)
            {
                _users.InsertOne(user);
                return user;
            }

            return null;
        }

        public void Update(string id, User newuser) =>
           _users.ReplaceOne(u => u.ID == id, newuser);

        public void Remove(User user)
        {
            user.MyDocs.ForEach(doc =>
            {
                _pages.DeleteMany(p => p.DocumentID == doc.ID);
                _docs.DeleteOne(d => d.ID == doc.ID);
            });
            
            _users.DeleteOne(u => u.ID == user.ID);
        }

        public void Remove(string id) =>
            _users.DeleteOne(u => u.ID == id);

        public User Login(string username, string password)
        {
            return _users.Find<User>(u => u.Username == username && u.Password==password).FirstOrDefault();
        }

        public List<MyDoc> GetUserDocs(string id)
        {
            User user = _users.Find<User>(u => u.ID == id).FirstOrDefault();
            return user.MyDocs;
        }

        public List<MyDoc> GetUserDocsFiltered(string id, DocFiltersDTO filters)
        {
            User user = _users.Find<User>(u => u.ID == id).FirstOrDefault();
            List<MyDoc> mydocs = user.MyDocs;

            if (filters.Name!="")
                mydocs = mydocs.Where(md=>md.Name==filters.Name).ToList();
            if (filters.Category!="0")
                mydocs = mydocs.Where(md => md.Category == filters.Category).ToList();
            if (filters.Access != "0")
                mydocs = mydocs.Where(md => (md.Public? "Public":"Private") == filters.Access).ToList();

            return mydocs;
        }

        public bool DeleteDoc(string author, string doc)
        {
            var filter = Builders<User>.Filter.Where(u => u.ID == author);
            var update = Builders<User>.Update.PullFilter(u => u.MyDocs, Builders<MyDoc>.Filter.Where(d => d.ID == doc));
            _users.UpdateOne(filter, update);

            return true;
        }

        public void Update(Doc doc)
        {
            MyDoc mdoc = new MyDoc();
            mdoc.ID = doc.ID;
            mdoc.Category = doc.Category;
            mdoc.Name = doc.Name;
            mdoc.Public = doc.Public;

            var filter = Builders<User>.Filter.Eq(x => x.ID, doc.Author.ID) &
                Builders<User>.Filter.ElemMatch(doc => doc.MyDocs, el => el.ID == doc.ID);
            var update = Builders<User>.Update.Set(doc => doc.MyDocs[-1], mdoc);

            _users.UpdateOne(filter, update);
        }

        public void EditUserInfo(string id, User newuser, EditUserInfoDTO info)
        {
            newuser.Country = info.Country;
            newuser.Password = info.Password;

            _users.ReplaceOne(u => u.ID == id, newuser);
        }
    }
}

