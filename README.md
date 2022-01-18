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

### Browserify

Bei [Browserify](https://browserify.org/) handelt es sich um ein JavaScript Bundler Tool,
welches es ermöglicht, Backend-Module von [npm](https://www.npmjs.com/) in einer Frontend-Umgebung
zu verwenden. Dabei durchsucht `Browserify` die [functions.js](./src/scripts/functions.js) Datei nach
`require()`-Aufrufen und analysiert diese. Nachfolgend wird ein Bundle erstellt, welches alle Funktionalitäten der
[functions.js](./src/scripts/functions.js) Datei enthält, aber auch zusätzlich die Funktionalitäten der erforderten
`npm`-Module. Diese Bundle-Datei kann dem Browser dann mithilfe eines `<script>` Tags
zur Verfügung gestellt werden. Somit können die `npm`-Module problemlos in der
[functions.js](./src/scripts/functions.js) Datei verwendet und im Browser ausgeführt werden.

Im Fall von `mathsteps` ist `Browserify` zwingend notwendig, da es nicht als Skript im Browser eingefügt werden
kann. Zusätzlich wurde `Nerdamer` auch mithilfe von `Browserify` eingebunden.

Weiterhin stellt `Browserify` auch noch einen "watch modus" in Form von
[watchify](https://github.com/browserify/watchify) zur Verfügung. Dieser ermöglich es, eine
bestimmte oder mehrere Dateien zu überwachen und bei Änderungen automatisch die Bundle-Datei neu zu bauen.
Somit muss das Bundle nicht nach jeder Änderung manuell gebaut werden.

### mathsteps

[Mathsteps](https://github.com/google/mathsteps) ist ein `npm`-Modul, welches zum Vereinfachen und Lösen von
Gleichungen verwendet werden kann. Zusätzlich gibt es ein `step`-Array aus, welche Informationen zu jedem
Lösungsschritt angibt. Dieses Array wurde verwendet, um Informationen für die optimalen Umformungsschritte
zu entnehmen. Außerdem wurde `mathsteps` auch zum Vereinfachen von Gleichungen verwendet. Es kann jedoch keine
Wurzeln und Potenzen handhaben, deshalb wird es nur bei einfachen Gleichungen benutzt.

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

## Limitierungen und Ausblick

Die Funktionalitäten der Website beinhalten ein paar Limitierungen. Eine davon ist
auf die hybride Nutzung von `Nerdamer` und `mathsteps` zurückzuführen. Beide Programme führen die Vereinfachung
von Gleichungen unterschiedlich durch. Wenn eine Gleichung dazu führt, dass `Nerdamer` und `mathsteps` gemeinsam
Vereinfachungen durchführen, kann es in seltenen Fällen zu Fehlern kommen. Das ist darauf zurückzuführen,
dass eine der beiden Bibliotheken Probleme mit der Syntax der von der anderen Bibliothek ausgegebenen Gleichung
hat und diese dann nicht optimal vereinfachen kann.

Bei der Verwendung von Wurzeln und Potenzen kann es dazu kommen, dass sich `Nerdamer` bei der Vereinfachung
von Gleichungen verfängt. In diesem Fall verhindert die suboptimale Vereinfachung von `Nerdamer`, dass der Nutzer
die Gleichung lösen kann. Dadurch kann es sein, dass eine Gleichung eigentlich optimal umgeformt wird, aber es
dem Nutzer nicht so kommuniziert wird.

Außerdem können Gleichungen, in denen die Zielvariable mit unterschiedlichen Exponenten vorkommt, nicht
gelöst werden. Dies trifft beispielsweise auf die Gleichung `2x^2+x=16` zu. Die Bibliothek `Nerdamer` kann
solche Gleichungen lösen. Allerdings unterstützt die Art und Weise der Gleichungsumstellung im EquationGuide
nur Gleichungen, bei denen sich infolge der vollständigen Umstellung nur noch eine Instanz der Zielvariablen
in der Gleichung befindet.

Komplexere Gleichungen können zu Problemen im Feedback- und Tippsystem führen. Dazu zählen Gleichungen, die komplexere
Ausdrücke als `x/y` beim Umformungsschritt umfassen. Sobald umfangreichere Umformungsschritte notwendig sind, wird es
sehr schwer, aus dem von `mathsteps` generierten `step`-Array die entsprechenden Werte auszulesen. Dadurch, dass
`mathsteps` keine Dokumentation besitzt, ist es problematisch, den genauen Aufbau des `step`-Arrays zu durchschauen
und die korrekten Datenpunkte anzusprechen. Folglich wird die Feedback- und Tippfunktion in solchen Fällen ausgestellt,
um falsches Feedback und falsche Tipps zu vermeiden. Jedoch kann das Feedback- und Tippsystem problemlos mit dem Lösen
von weniger komplexen Gleichungen umgehen.

Die letzte bekannte Limitation ist, dass es beim Lösen von Gleichungen, die Wurzeln und Potenzen enthalten, eine geringe
Wahrscheinlichkeit gibt, dass das Feedbacksystem ein falsches Feedback zu einem Umformungsschritt zurückgibt. So kann es
beispielsweise passieren, dass dem Nutzer ein negatives Feedback gegeben wird, obwohl er einen optimalen Umformungsschritt
durchgeführt hat. Das ist auf das o.g. Problem zurückzuführen, dass `Nerdamer` keine schrittweise Lösung von
Gleichungen anbietet und Umformungsschritte somit manuell ausgewertet werden müssen. Dabei kann es z.B. beim
Zählen von Operanden zu Fehlern kommen.

Bei den bekannten Limitationen ist zu erkennen, dass vorrangig komplexere Gleichungen und Gleichungen mit Wurzeln
und Potenzen zu Problemen führen können. Dadurch, dass das Programm für SchülerInnen der ersten Sekundarstufe entwickelt
wurde, sollte es zu keinen großen Problemen in der tatsächlichen Ausführung kommen. Jedoch müsste das Programm
noch erweitert und verbessert werden, falls es auch problemlos für Gleichungen auf dem Niveau der zweiten Sekundarstufe
funktionieren soll.

Wie zu erkennen ist, weist das Programm teilweise Verbesserungspotentiale auf. Im Rahmen von Weiterentwicklungen
des EquationGuide sollten zunächst alle bekannten Limitationen behoben werden. Ein optimaler Weg wäre, die
hybride Verwendung von `Nerdamer` und `mathsteps` zu vermeiden. `Nerdamer` wird nur für Gleichungen mit Wurzeln und Potenzen benötigt.
Somit könnte `mathsteps` um diese Funktionalität erweitert werden. Es handelt sich dabei um ein Open Source Projekt von Google, das jedoch
mittlerweile  inaktiv ist. Somit müssten Änderungen an `mathsteps` lokal über ein Fork stattfinden. Wenn `mathsteps`
Wurzeln und Potenzen handhaben könnte, d.h. entsprechende Umformungsschritte generieren und Gleichungen
vereinfachen könnte, wäre es möglich, ausschließlich `mathsteps` zu verwenden, `Nerdamer` aus dem Projekt zu entfernen
und somit die Probleme der hybriden Verwendung zu beseitigen. Weiterhin könnte auch eine robuste und umfangreiche
Dokumentation für `mathsteps` hinzugefügt werden, um die Benutzung verständlicher und einfacher zu gestalten.

Sobald alle Probleme behoben sind, kann das Programm noch um ein System erweitert werden, welches das Lösen von
Gleichungssystemen ermöglicht. Hierbei sollte das gleiche Prinzip angewandt werden, sodass der Nutzer die
Möglichkeit hat, die einzelnen Umformungsschritte selbst einzugeben und darauf Feedback und Tipps zu erhalten. Die Bibliothek
`Nerdamer` ist fähig, Gleichungssysteme einfachen Niveaus zu lösen. Allerdings unterstützt keine der
vorhandenen Bibliotheken das schrittweise Lösen von Gleichungssystemen. Dementsprechend müsste das Feedback- und Tippsystem
für Gleichungssysteme selbstständig entworfen und entwickelt werden. Auch hier würde es sich anbieten, `mathsteps` zu erweitern
und auf den bereits vorhandenen Grundlagen aufzubauen. Wenn es `mathsteps` oder eine ähnliche Bibliothek ermöglichen,
bei Eingabe des Gleichungssystems eine schrittweise Lösung zu generieren, müsste nur noch eine zur aktuellen Version
ähnliche, benutzerfreundliche Oberfläche angelegt werden, worüber der Nutzer Gleichungssysteme mithilfe von Feedback und
Tipps lösen kann.
