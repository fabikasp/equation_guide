# EquationGuide

Die Digitalisierung der Schulen und computergestützte Entlastung der Lehrkräfte in Deutschland
sind unausweichliche Aufgaben der nächsten Jahre. Visualisierungen und Beschreibungen
mathematischer Probleme sind für SchülerInnen mittlerweile überall auffindbar. Für
bestimmte mathematische Aufgabentypen fehlen allerdings automatische Feedbacksysteme.

EquationGuide stellt eine Website dar, die SchülerInnen dabei unterstützen soll, das Lösen
von Gleichungen zu erlernen und zu üben. Im Zuge dessen lösen SchülerInnen Gleichungen
selbstständig und bekommen aufgrund des integrierten Feedback- und Tippsystems jederzeit
positive oder negative Rückmeldungen zur Vorgehensweise.

## Verwendung

1. Eingabe des linken und rechten Teils der Gleichung
2. Eingabe der Zielvariable, nach der die Gleichung umgestellt werden soll
3. Betätigung des Buttons `Start`
4. Eingabe der Rechenoperation, die auf die Gleichung angewendet werden soll
5. Eingabe des Umformungsschritts, der auf die Gleichung angewendet werden soll
6. Betätigung des Buttons `Umformen`
7. Wiederholung von 4. - 6. bis die Gleichung gelöst ist

Zum Ein- und Ausschalten der Bedienungshilfe kann der Button `Hilfe einschalten`
bzw. `Hilfe ausschalten` verwendet werden.

Der Button `Neustart` kann betätigt werden, wenn ein neuer Lösungsprozess
mit einer neuen Gleichung gestartet werden soll.

Zum Löschen des letzten Umformungsschritts wird der Button `Zurücksetzen` verwendet.

Durch die Betätigung des Buttons `Tipp` erhält man einen zufälligen Tipp für
den nächsten Umformungsschritt.

## Installation und Ausführung

1. Herunterladen von [Node.js](https://nodejs.org/en/download/), um den HTTP-Server
   nutzen zu können
2. Ausführung von `npm install` im Repository-Verzeichnis, um alle Abhängigkeiten
   der Software zu installieren
3. Ausführung von `npm start` im Repository-Verzeichnis, um die Software zu starten
4. Aufruf von [http://localhost:8080](http://localhost:8080) in einem beliebigen Browser, um die Software
   nutzen zu können

## Testing

Zur Ausführung der implementierten Unit-Tests muss der Befehl `npm test` im
Repository-Verzeichnis ausgeführt werden.

## Werkzeuge und Softwarearchitektur

**HTML, CSS und Bootstrap**

Für die Strukturierung und Gestaltung der DOM-Elemente werden HTML sowie CSS und
das CSS-Framework Bootstrap verwendet. Die Landing-Page, die sofort zur Hauptseite
weiterleitet, befindet sich in der Datei [index.html](./index.html). Die Hauptseite
ist in [equation-guide.html](./src/view/equation-guide.html) gespeichert. Die zur
Gestaltung notwendigen Dateien befinden sich im Verzeichnis [stylesheets](./src/stylesheets).
Die zur Nutzung von Bootstrap notwendige *.css-Datei ist im Verzeichnis
[vendor](./src/stylesheets/vendor) abgelegt. Um individuelle, von Bootstrap unabhängige
Gestaltungen anwenden und die gesamte Website für Mobilgeräte optimieren zu können,
wird zusätzlich die Datei [equation-guide-styles.css](./src/stylesheets/equation-guide-styles.css)
genutzt.

**JavaScript und jQuery**

Zur Umsetzung der Funktionalitäten der DOM-Elemente werden JavaScript und jQuery
verwendet. Weder eine zusätzliche Bibliothek noch ein zusätzliches Framework
zur Erstellung von Webapplikationen werden genutzt. Die entsprechenden *.js-Dateien
befinden sich im Verzeichnis [scripts](./src/scripts). Im Unterverzeichnis
[vendor](./src/scripts/vendor) sind alle zur Nutzung von jQuery und Bootstrap
notwendigen *.js-Dateien zu finden. In der Datei [event-handlers.js](./src/scripts/event-handlers.js)
sind alle Event-Handler implementiert, um auf relevante DOM-Ereignisse wie z.B.
auf das Drücken des `Start`-Buttons reagieren zu können. Um auf einfache Art und Weise
auf DOM-Elemente zuzugreifen, findet jQuery Anwendung. Die infolge eines DOM-Ereignisses
auszuführende Logik ist in der Datei [functions.js](./src/scripts/functions.js)
implementiert. Dazu gehören u.a. die Validierung der Startgleichung und von Umformungsschritten,
die Feedback- und Tippgenerierung oder die Vereinfachung und Formatierung von
Zwischen- oder Endergebnissen. Dynamische DOM-Elemente, die nicht über die gesamte Laufzeit der Website
angezeigt werden, befinden sich in der Datei [templates.js](./src/scripts/templates.js)
und werden bei Bedarf in der Datei [event-handlers.js](./src/scripts/event-handlers.js)
in den DOM geladen.

**Browserify**

**mathsteps**

**Nerdamer**

[Nerdamer](https://nerdamer.com/) ist eine JavaScript-Bibliothek zur Auswertung
mathematischer Ausdrücke, Gleichungen und Gleichungssysteme. Im Gegensatz zu
`mathsteps` unterstützt `Nerdamer` Wurzeln und Potenzen. Aus diesem Grund wird
die Bibliothek zur Vereinfachung von Gleichungen verwendet, die `mathsteps` nicht
vereinfachen kann. Des Weiteren wird `Nerdamer` genutzt, um bei der Validierung
der Startgleichung zu überprüfen, ob die vorliegende Gleichung überhaupt gelöst
werden kann. Für Gleichungen, die Wurzeln und Potenzen enthalten, wird `Nerdamer`
zudem zur Feedback- und Tippgenerierung verwendet. Allerdings bietet die Bibliothek
keine schrittweise Lösung von Gleichungen an. Dementsprechend bringt die Feedback-
und Tipplogik für Gleichungen dieser Art höhere Anforderungen mit sich. Die Logik
beinhaltet u.a. das Zählen von Operanden vor und nach einer Umformung sowie das
Ermitteln der Notwendigkeit des Wurzelziehens oder Potenzierens als Umformungsschritt.

**Jest**

Es soll gewährleistet sein, dass infolge von Änderungen am Code überprüft werden kann,
ob alle Funktionalitäten der Software weiterhin korrekt funktionieren. Zu diesem Zweck
wurden das Test-Framework [Jest](https://jestjs.io/) in das Softwareprojekt integriert und Unit-Tests
für nahezu alle in der Datei [functions.js](./src/scripts/functions.js) befindlichen Funktionen
angefertigt. Die genannten Unit-Tests liegen im Verzeichnis [test](./test).

-- später Löschen --
- Funktionalitäten (Erzeugen der Formulare Desktop / Mobile, Startvalidierung, Feedback- und Tippgenerierung, Hilfe-Feature, Validierung der        
  Umformungsschritte, Eventhandler hinter Umformungsschritt-Input, Neustart, Zurücksetzen, Ergebnisformatierung etc.)
- in jedem Punkt darauf eingehen, in welchem Ordner das gespeichert ist
-- später Löschen --

## Limitierungen und Ausblick

Die Funktionalitäten der Website bringen ein paar Limitierungen mit sich. Eine davon ist
auf die hybride Nutzung von `Nerdamer` und `mathsteps` zurückzuführen (ist das noch so?)...

-- später Löschen --
- Known Bugs (siehe Bugs in Trello)
- Gleichungssysteme
-- später Löschen --
