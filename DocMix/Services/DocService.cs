using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace DocMix.Services
{
    public class DocService
    {
        private readonly IMongoCollection<Doc> _docs;
        private readonly IMongoCollection<User> _users;

        public DocService(IDocMixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _docs = database.GetCollection<Doc>("Docs");
            _users = database.GetCollection<User>("Users");
        }

        public List<Doc> Get() =>
            _docs.Find(d => true).ToList();

        public Doc Get(string id) =>
            _docs.Find<Doc>(d => d.ID == id).FirstOrDefault();

        public Doc Create(Doc doc)
        {
            _docs.InsertOne(doc);
         
            MyDoc mydoc = new MyDoc();
            mydoc.ID = doc.ID;
            mydoc.Name = doc.Name;
            mydoc.Category = doc.Category;
            
            User user = _users.Find<User>(u => u.ID == doc.Author.ID).FirstOrDefault();
            user.MyDocs.Add(mydoc);
            _users.ReplaceOne(d => d.ID == doc.Author.ID, user);

            return doc;
        }

        public void Update(string id, Doc newdoc) =>
           _docs.ReplaceOne(d => d.ID == id, newdoc);

        public void Remove(Doc doc) =>
            _docs.DeleteOne(d => d.ID == doc.ID);

        public void Remove(string id) =>
            _docs.DeleteOne(d => d.ID == id);
    }
}
