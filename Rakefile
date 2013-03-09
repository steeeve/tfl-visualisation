task :default => [:build]

task :build do
    system("./node_modules/requirejs/bin/r.js -o js/main.build.js")
    system("./node_modules/less/bin/lessc -x css/tfl.less > css/tfl.css")
end