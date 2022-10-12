.DEFAULT_GOAL := dist/assistant
.PHONY: clean

NPM=npm --silent run

clean:
	rm -rf ./build ./dist

build/%.js: src/%.ts
	$(NPM) tsc

dist/assistant: build/main.js build/**/*.js
	$(NPM) pkg -- --compress GZip --config package.json --output $@ --targets host $<
