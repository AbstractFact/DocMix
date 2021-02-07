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
    public class PageService
    {
        private readonly IMongoCollection<Page> _pages;

        public PageService(IDocMixDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _pages = database.GetCollection<Page>("Pages");
        }

        public List<Page> Get() =>
            _pages.Find(d => true).SortBy(d => d.Position).ToList();

        public Page Get(string id) =>
            _pages.Find(d => d.ID == id).FirstOrDefault();

        public Page Create(Page pag)
        {
            _pages.InsertOne(pag);

            return pag;
        }

        public void Update(string id, Page newpag) =>
           _pages.ReplaceOne(d => d.ID == id, newpag);

        public void Remove(Page pag) =>
            _pages.DeleteOne(d => d.ID == pag.ID);

        public void Remove(string id) =>
            _pages.DeleteOne(d => d.ID == id);


        public List<Page> GetPages(string docid)=>
            _pages.Find(p => p.DocumentID == docid).ToList();
        
    }
}
