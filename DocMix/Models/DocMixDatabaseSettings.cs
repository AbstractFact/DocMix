using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.Models
{
    public class DocMixDatabaseSettings : IDocMixDatabaseSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IDocMixDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
