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
Im Unterverzeichnis [vendor](./src/stylesheets/vendor) ist die zur Nutzung von Bootstrap notwendige
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
auf DOM-Elemente zuzugreifen und DOM-Ereignisse zu verarbeiten, findet jQuery Anwendung.
Die infolge von DOM-Ereignissen auszuführenden Logiken sind in der Datei [functions.js](./src/scripts/functions.js)
implementiert. Dazu gehören u.a. die Validierung der Startgleichung und von Umformungsschritten,
die Feedback- und Tippgenerierung sowie die Vereinfachung und Formatierung von
Zwischen- oder Endergebnissen. Dynamische DOM-Elemente, die nicht über die gesamte Laufzeit der Website
angezeigt werden, befinden sich in der Datei [templates.js](./src/scripts/templates.js)
und werden bei Bedarf in der Datei [event-handlers.js](./src/scripts/event-handlers.js)
in den DOM geladen.

### Browserify

Bei [Browserify](https://browserify.org/) handelt es sich um ein JavaScript Bundler Tool,
welches es ermöglicht, Backend-Module von [npm](https://www.npmjs.com/) in einer Frontend-Umgebung
zu verwenden. Dabei durchsucht `Browserify` die [functions.js](./src/scripts/functions.js) Datei nach
`require()`-Aufrufen und analysiert diese. Nachfolgend wird ein Bundle erstellt, welches alle Funktionalitäten der
[functions.js](./src/scripts/functions.js) Datei und der erforderten `npm`-Module enthält.
Diese Bundle-Datei kann dem Browser dann mithilfe eines `<script>` Tags
zur Verfügung gestellt werden. Somit können die `npm`-Module problemlos in der
[functions.js](./src/scripts/functions.js) Datei verwendet und im Browser ausgeführt werden.

Im Fall von `mathsteps` ist `Browserify` zwingend notwendig, da es nicht als Skript im Browser eingefügt werden
kann. Zusätzlich wurde `Nerdamer` mithilfe von `Browserify` eingebunden.

Weiterhin stellt `Browserify` einen "Watch-Modus" in Form von [watchify](https://github.com/browserify/watchify)
zur Verfügung. Dieser ermöglicht es, eine bestimmte oder mehrere Dateien zu überwachen und bei Änderungen automatisch
die Bundle-Datei zu aktualisieren. Somit muss das Bundle nicht nach jeder Änderung manuell gebaut werden.

### mathsteps

[Mathsteps](https://github.com/google/mathsteps) ist ein `npm`-Modul, welches zum Vereinfachen und Lösen von
Gleichungen verwendet werden kann. Zusätzlich gibt es ein `step`-Array aus, welches Informationen zu jedem
Lösungsschritt angibt. Dieses Array wurde verwendet, um Informationen über die optimalen Umformungsschritte
zu entnehmen und daraus Feedback und Tipps zu generieren. Leider kann die Bibliothek keine Wurzeln und Potenzen
handhaben, weshalb sie nur bei einfachen Gleichungen benutzt wird.

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
von Gleichungen verfängt. In diesem Fall verhindert die suboptimale Vereinfachung von `Nerdamer`, dass NutzerInnen
die Gleichung lösen können.

Außerdem können Gleichungen, in denen die Zielvariable mit unterschiedlichen Exponenten vorkommt, nicht
gelöst werden. Dies trifft beispielsweise auf die Gleichung `2x^2+x=16` zu. Die Bibliothek `Nerdamer` kann
solche Gleichungen lösen. Allerdings unterstützt die Art und Weise der Gleichungsumstellung im EquationGuide
nur Gleichungen, bei denen sich infolge der vollständigen Umstellung nur noch eine Instanz der Zielvariable
in der Gleichung befindet.

Komplexere Gleichungen können zu Problemen im Feedback- und Tippsystem führen. Dazu zählen Gleichungen, die komplexere
Ausdrücke als `x/y` beim Umformungsschritt umfassen. Sobald umfangreichere Umformungsschritte notwendig sind, wird es
sehr schwer, aus dem von `mathsteps` generierten `step`-Array die entsprechenden Werte auszulesen. Dadurch, dass
`mathsteps` keine Dokumentation besitzt, ist es problematisch, den genauen Aufbau des `step`-Arrays zu durchschauen
und die korrekten Datenpunkte anzusprechen. Folglich wird die Feedback- und Tippfunktion in solchen Fällen ausgestellt,
um falsches Feedback und falsche Tipps zu vermeiden. Jedoch kann das Feedback- und Tippsystem problemlos mit dem Lösen
von weniger komplexen Gleichungen umgehen.

Die letzte bekannte Limitierung ist, dass es beim Lösen von Gleichungen, die Wurzeln und Potenzen enthalten, eine geringe
Wahrscheinlichkeit gibt, dass das Feedbacksystem ein falsches Feedback zu einem Umformungsschritt zurückgibt. So kann es
beispielsweise passieren, dass NutzerInnen ein negatives Feedback ausgespielt wird, obwohl ein optimaler Umformungsschritt
durchgeführt wurde. Das ist auf das o.g. Problem zurückzuführen, dass `Nerdamer` keine schrittweise Lösung von
Gleichungen anbietet und Umformungsschritte somit manuell ausgewertet werden müssen. Dabei kann es z.B. beim
Zählen von Operanden zu Fehlern kommen.

Bei den bekannten Limitationen sticht heraus, dass vorrangig umfangreichere Gleichungen und Gleichungen mit Wurzeln
und Potenzen zu Problemen führen können. Dadurch, dass das Programm primär für SchülerInnen niedriger Klassenstufen entwickelt wurde, sollte es zu keinen großen Problemen in der tatsächlichen Ausführung kommen. Jedoch müsste das Programm noch erweitert und verbessert werden, falls es auch problemlos für Gleichungen auf dem Niveau höherer Klassenstufen funktionieren soll.

Wie zu erkennen ist, weist das Programm teilweise Verbesserungspotentiale auf. Im Rahmen von Weiterentwicklungen
des EquationGuide' sollten zunächst alle bekannten Limitationen behoben werden. Ein optimaler Schritt wäre es, die
hybride Verwendung von `Nerdamer` und `mathsteps` zu vermeiden. `Nerdamer` wird nur für Gleichungen mit Wurzeln und Potenzen benötigt.
Somit könnte `mathsteps` um diese Funktionalität erweitert werden. Es handelt sich dabei um ein Open Source Projekt von Google, das jedoch
mittlerweile  inaktiv ist. Somit müssten Änderungen an `mathsteps` lokal über ein Fork stattfinden. Wenn `mathsteps`
Wurzeln und Potenzen handhaben könnte, d.h. entsprechende Umformungsschritte generieren und Gleichungen
vereinfachen könnte, wäre es möglich, ausschließlich `mathsteps` zu verwenden, `Nerdamer` aus dem Projekt zu entfernen
und somit die Probleme der hybriden Verwendung zu beseitigen. Weiterhin könnte eine robuste und umfangreiche
Dokumentation für `mathsteps` bereitgestellt werden, um die Benutzung verständlicher und einfacher zu gestalten.

Sobald alle Verbesserungspotentiale ausgeschöpft wurden, kann das Programm noch um ein System erweitert werden, welches das Lösen von
Gleichungssystemen ermöglicht. Hierbei sollte das gleiche Prinzip wie in der aktuellen Version angewandt werden, sodass NutzerInnen die
Möglichkeit haben, die einzelnen Umformungsschritte selbst einzugeben und dafür Feedback und Tipps zu erhalten. Die Bibliothek
`Nerdamer` ist fähig, Gleichungssysteme einfachen Niveaus zu lösen. Allerdings unterstützt keine der
vorhandenen Bibliotheken das schrittweise Lösen von Gleichungssystemen. Dementsprechend müsste das Feedback- und Tippsystem
für Gleichungssysteme selbstständig entworfen und entwickelt werden. Auch hier würde es sich anbieten, `mathsteps` zu erweitern
und auf den bereits vorhandenen Grundlagen aufzubauen. Wenn es `mathsteps` oder eine ähnliche Bibliothek ermöglichen,
bei Eingabe des Gleichungssystems eine schrittweise Lösung zu generieren, müsste nur noch eine zur aktuellen Version
ähnliche, benutzerfreundliche Oberfläche angelegt werden, worüber NutzerInnen Gleichungssysteme mithilfe von Feedback und
Tipps lösen können.

## Lizenzen

### Nerdamer

Copyright (c) 2015 Martin Donk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


### mathsteps

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2017 Evy Kassirer

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
