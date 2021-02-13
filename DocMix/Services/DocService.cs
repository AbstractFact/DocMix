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
        private readonly IMongoCollection<Page> _pages;
        private readonly IMongoCollection<User> _users;

        public DocService(IDocMixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _docs = database.GetCollection<Doc>("Docs");
            _pages = database.GetCollection<Page>("Pages");
            _users = database.GetCollection<User>("Users");
        }

        public List<Doc> Get() =>
            _docs.Find<Doc>(d => d.Public == true).ToList();

        public Doc Get(string id) =>
            _docs.Find<Doc>(d => d.ID == id).FirstOrDefault();

        public Doc Create(Doc doc)
        {
            _docs.InsertOne(doc);

            Page pag = new Page();
            pag.DocumentID = doc.ID;
            pag.Position = 1.0;
            _pages.InsertOne(pag);

            MyDoc mydoc = new MyDoc();
            mydoc.ID = doc.ID;
            mydoc.Name = doc.Name;
            mydoc.Category = doc.Category;
            mydoc.Public = doc.Public;

            var filter = Builders<User>.Filter.Where(u => u.ID == doc.Author.ID);
            var update = Builders<User>.Update.Push("MyDocs", mydoc);
            _users.UpdateOne(filter, update);

            return doc;
        }

        public void Update(string id, Doc newdoc) =>
           _docs.ReplaceOne(d => d.ID == id, newdoc);

        public void Remove(Doc doc) =>
            _docs.DeleteOne(d => d.ID == doc.ID);

        public void Remove(string id) =>
            _docs.DeleteOne(d => d.ID == id);

        public void UpdatePagenum(string id, int num)
        {
            var update = Builders<Doc>.Update.Inc("PageNum", num);

            var result = _docs.UpdateOne(d=>d.ID==id, update);
        }
    }
}
