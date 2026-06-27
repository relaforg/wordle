build:
	cd server && cargo build --release

run:
	cd server && ./target/release/server &

stop:
	-pkill -f 'target/release/server'

clean:
	cd server && cargo clean
