using Microsoft.Win32;
using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Windows;

namespace Wpf
{
    public partial class MainWindow : Window
    {
        public ObservableCollection<OrarendElem> OrarendLista { get; set; } = new();
        public ObservableCollection<Teendo> TeendokLista { get; set; } = new();

        public MainWindow()
        {
            InitializeComponent();
            dgOrarend.ItemsSource = OrarendLista;
            dgTeendok.ItemsSource = TeendokLista;
        }

        private void Betoltes_Click(object sender, RoutedEventArgs e)
        {
            if (File.Exists("orarend.txt"))
            {
                var sorok = File.ReadAllLines("orarend.txt");
                foreach (var sor in sorok)
                {
                    var reszek = sor.Split(';');
                    if (reszek.Length == 5)
                        OrarendLista.Add(new OrarendElem(reszek[0], reszek[1], reszek[2], reszek[3], reszek[4]));
                }
            }

            if (File.Exists("teendok.txt"))
            {
                var sorok = File.ReadAllLines("teendok.txt");
                foreach (var sor in sorok)
                {
                    var reszek = sor.Split(';');
                    if (reszek.Length == 4)
                        TeendokLista.Add(new Teendo(reszek[0], reszek[1], DateTime.Parse(reszek[2]), reszek[3]));
                }
            }
        }

        private void Mentes_Click(object sender, RoutedEventArgs e)
        {
            File.WriteAllLines("orarend.txt", OrarendLista.Select(o => $"{o.Nap};{o.Idopont};{o.Tantargy};{o.Tanar};{o.Terem}"));
            File.WriteAllLines("teendok.txt", TeendokLista.Select(t => $"{t.Tipus};{t.Tantargy};{t.Hatarido:yyyy-MM-dd};{t.Statusz}"));
        }

        private void HozzaadOrarend_Click(object sender, RoutedEventArgs e)
        {
            OrarendLista.Add(new OrarendElem("hétfő", "08:00", "matek", "Kiss tanár", "1-es terem"));
        }

        private void HozzaadTeendo_Click(object sender, RoutedEventArgs e)
        {
            TeendokLista.Add(new Teendo("házi feladat", "matek", DateTime.Now.AddDays(3), "nem kész"));
        }
    }

    public class OrarendElem
    {
        public string Nap { get; set; }
        public string Idopont { get; set; }
        public string Tantargy { get; set; }
        public string Tanar { get; set; }
        public string Terem { get; set; }

        public OrarendElem(string nap, string idopont, string tantargy, string tanar, string terem)
        {
            Nap = nap;
            Idopont = idopont;
            Tantargy = tantargy;
            Tanar = tanar;
            Terem = terem;
        }
    }

    public class Teendo
    {
        public string Tipus { get; set; }
        public string Tantargy { get; set; }
        public DateTime Hatarido { get; set; }
        public string Statusz { get; set; }

        public Teendo(string tipus, string tantargy, DateTime hatarido, string statusz)
        {
            Tipus = tipus;
            Tantargy = tantargy;
            Hatarido = hatarido;
            Statusz = statusz;
        }
    }
}
