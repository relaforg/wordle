build:
	cd server && cargo build --release
	cd front && npm install && npm run build

run:
	cd server && ./target/release/server &
	cd front && npm run preview &

stop:
	-pkill -f 'target/release/server'
	-pkill -f 'npm run preview'
	-pkill -f "$(CURDIR)/front/node_modules/.bin/vite preview"

clean:
	cd server && cargo clean
	cd front && rm -rf node_modules/ dist/
