# Órarend

📅 Órarend és teendő-kezelő alkalmazás – C# (WinForms/WPF)
🧩 Fő funkciók:
1. Órarend kezelése
Napokra bontott nézet (Hétfő–Péntek).

Minden naphoz hozzáadható tantárgy, időpont, tanár, terem.

Megjelenítés táblázatos formában (DataGridView vagy ListView).

2. Teendők kezelése
Teendők típus szerint: házi feladat, dolgozat, egyéb.

Adatok: leírás, tantárgy, határidő, státusz (kész/nem kész).

Teendő hozzáadása, szerkesztése, törlése.

3. Keresés/szűrés
Szűrés határidőre, státuszra, tantárgyra.

Keresőmező, ahol szövegre is lehet szűrni.

4. Adatok mentése/betöltése
Mentés egyszerű .txt vagy .csv fájlba (vagy JSON/XML, ha kicsit haladóbb megoldást akartok).

Betöltés fájlból indításkor.

Opcionálisan automatikus mentés bezáráskor.

🧑‍💻 Fejlesztési eszközök és technológiák:
C# nyelv

Windows Forms vagy WPF (ha szebb dizájnt szeretnétek)

Visual Studio fejlesztői környezet

Fájlkezelés (pl. StreamWriter, StreamReader, File, Directory)

🖼️ Felhasználói felület ötlet:
Főablak: két fő rész: Órarend és Teendők

Navigációs gombok vagy tabok a két rész között

Formok az új elem hozzáadásához/szerkesztéséhez

Lista vagy táblázat a megjelenítéshez

Keresőmező és szűrő legfelül

💾 Mentési formátum példa (.txt vagy .csv)
Teendők például:

házi feladat;matek;2025-05-25;nem kész
dolgozat;fizika;2025-05-30;kész

Órarend például:

hétfő;08:00;matek;Kiss tanár;1-es terem
hétfő;09:00;töri;Nagy tanár;2-es terem