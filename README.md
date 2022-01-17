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
### HTML, CSS und Bootstrap

Für die Strukturierung und Gestaltung der DOM-Elemente werden HTML sowie CSS und
das CSS-Framework Bootstrap verwendet. Die Landing-Page, die sofort zur Hauptseite
weiterleitet, befindet sich in der Datei [index.html](./index.html). Die Hauptseite
ist in [equation-guide.html](./src/view/equation-guide.html) gespeichert. Die zur
Gestaltung notwendigen Dateien befinden sich im Verzeichnis [stylesheets](./src/stylesheets).
Im Verzeichnis [vendor](./src/stylesheets/vendor) ist die zur Nutzung von Bootstrap notwendige
*.css-Datei abgelegt. Um individuelle, von Bootstrap unabhängige Gestaltungen anwenden und
die gesamte Website auf unterschiedliche Bildschirmgrößen abstimmen zu können, wird zusätzlich die Datei
[equation-guide-styles.css](./src/stylesheets/equation-guide-styles.css) genutzt.

### JavaScript und jQuery

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

### mathsteps

[Mathsteps](https://github.com/google/mathsteps) ist ein `NPM`-Modul, welches zum Vereinfachen und Lösen von
Gleichungen verwendet werden kann. Zusätzlich gibt es ein `step`-Array aus, welche Informationen zu jeden
Lösungschritt angibt. Dieses Array wurde verwendet, um Informationen für die optimalen Umformungsschritte
zu entnehmen. Außerdem wurde `mathsteps` auch zum Vereinfach von Gleichungen verwendet. Es kann jedoch keine
Wurzeln und Potenzen handhaben, deshalb wird es nur bei einfach Gleichungen benutzt. 

### Browserify

Bei [Browserify](https://browserify.org/) handelt es sich um ein JavaScript Bundler Tool,
welches es ermöglicht Backend Module von [NPM](https://www.npmjs.com/) in einer Frontend-Umgebung
zu verwenden. Dabei durchsucht `Browserify` die [functions.js](./src/scripts/functions.js) nach `require()` 
Aufrufen und analysiert diese. Nachfolgend wird ein Bundle erstellt, welches alle Funktionalitäten der
[functions.js](./src/scripts/functions.js) Datei enthält, aber auch zusätzliche die Funktionalitäten der erforderten 
`NPM`-Module. Diese Bundle-Datei kann dann mit Hilfe eines `<script>` tags dem Browser
zur Verfügung gestellt werden. Somit können die `NPM`-Module problemlos in der 
[functions.js](./src/scripts/functions.js) Datei verwendet und im Browser ausgeführt werden.

Im Fall von `mathsteps` ist `Browserify` zwingend notwenig, da es nicht als Script im Brwoser eingefügt werden
kann. Zusätzlich wurde `Nerdamer` auch mit Hilfe von `Browserify` eingebunden. 

### Nerdamer

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

### Jest

Es soll gewährleistet sein, dass die Software gewisse Anforderungen erfüllt und dass infolge
von Änderungen am Code überprüft werden kann, ob alle Funktionalitäten der Software weiterhin korrekt
funktionieren. Zu diesem Zweck wurden das Test-Framework [Jest](https://jestjs.io/) in das
Softwareprojekt integriert und Unit-Tests für nahezu alle in der Datei [functions.js](./src/scripts/functions.js)
befindlichen Funktionen angefertigt. Die genannten Unit-Tests liegen im Verzeichnis [test](./test).

-- später Löschen --
- Funktionalitäten (Erzeugen der Formulare Desktop / Mobile, Startvalidierung, Feedback- und Tippgenerierung, Hilfe-Feature, Validierung der        
  Umformungsschritte, Eventhandler hinter Umformungsschritt-Input, Neustart, Zurücksetzen, Ergebnisformatierung etc.)
- in jedem Punkt darauf eingehen, in welchem Ordner das gespeichert ist
-- später Löschen --

## Limitierungen und Ausblick

Die Funktionalitäten der Website beinhalten ein paar Limitierungen. Eine davon ist
auf die hybride Nutzung von `Nerdamer` und `mathsteps` zurückzuführen. Beide Programme führen die Vereinfachung
von Gleichungen unterschiedlich durch und wenn eine Gleichung dazu führt, dass `Nerdamer` und `mathsteps`
Vereinfachungen durchführen, kann es in seltenen Fällen zu Fehlern führen, da das jeweils andere Programm
Probleme mit dem Syntax der Gleichung hat und diese dann nicht optimal Vereinfacht. 

Bei der Verwendung von Wurzeln und Potenzen kann es dazu führen, dass sich `Nerdamer` bei der Gleichungslösung
verfängt, wenn die Vereinfachung nicht optimal durchgeführt wird. Dadurch kann es sein, dass eine Gleichung
eigentlich optimal gelößt wurde, aber durch unzureichende Vereinfachung von `Nerdamer` es dem Nutzer nicht so
kommuniziert wird.

Außerdem können Gleichungen, in denen die Zielvariable mit unterschiedlichen Expontenten vorkommen, nicht 
gelößt werden. In der Oberfäche des Programmes ist es nicht möglich, dass der Nutzer zu einer optimalen Lösung,
mit einem optimalen Lösungsweg, kommen kann. *(Hier kannst du vllt noch hinschreiben warum es nicht geht. Mir fällt
nichts richtig ein wie ich es gut beschreiben kann)*

Komplexere Gleichungen können zu Problemen im Feedback- und Tippbacksystem führen. Dazu zählen Gleichungen die komplexere
Werte beim Umformungsschritt als "x/y" umfassen. Sobald umfangreichere Umformungsschritte notwendig sind, wird es
sehr schwer aus dem von `mathstep` generierten `step`-Array die entsprechenden Werte auszulesen. Dadurch dass
`mathsteps` keine Dokumentation besitzt ist es problematisch den genauen Aufbau des `step`-Arrays zu durchschauen
und die korrekten Datenpunkte anzusprechen. Deshalb wird in dem Fall die Feedback- und Tippfunktion eingestellt,
um falsches Feedback zu vermeiden. Das Lösen von weniger komplexe Gleichungen kann jedoch problemlos mit dem 
Feedback- und Tippsystem begleitet werden.

Die letzte bekannt Limitation ist, dass es beim Lösen von Gleichungen mit Wurzeln und Potenzen eine sehr geringe
Wahrscheinlichkeit gibt, dass das Feedbackystem ein falsches Feedback zu einem Umformungsschritt zurück gibt.
*(Wenn du weißt, warum das passieren kann, kannst du ja hier noch hinzufügen)*

Bei den bekannten Limitationen ist zu erkennen, das besonders komplexere Gleichungen und Gleichungen mit Wurzeln
und Potenzen zu Problemen führen können. Dadurch, dass das Programm für Schüler der Klassenstufen 5-7 entwicklet
wurde, sollte es zu keinen großen Problemen in der tatsächlichen Ausführung kommen, jedoch müsste das Programm
noch erweitert und verbessert werden, falls es auch komplett problemlos für weiterführende Klassenstufen 
funktionieren soll.

-- später Löschen --
- Known Bugs (siehe Bugs in Trello)
- Gleichungssysteme
-- später Löschen --
