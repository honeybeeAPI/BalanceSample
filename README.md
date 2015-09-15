BalanceSample is a cordova based example application for implementing a login sequence and getting a current account balance.

prerequisites :
apache cordova 
https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html

clone this application and cd into the cloned directory

Add your platform with the following command :

<pre><code>cordova platform add ios</code></pre>
or
<pre><code>cordova platform add android</code></pre>

Install the needed inappbrowser plugin) :

<pre><code>cordova plugin add org.apache.cordova.inappbrowser</code></pre>

Fill in the clientId and clientSecret variables in the www/index.js file (top of the file) with your API application credentials

Run or emulate the application with :

<pre><code>cordova run ios</code></pre>
or
<pre><code>cordova run android</code></pre>
