/**
 * IMPORTANT!
 *
 * This script removes PHP 8 type annotations of pipes (|) from bootstrap file of symfony/polyfill-mbstring package
 * because php linter of of WordPress.org uses PHP 7.4 which cannot recognize pipe symbols in type annotations.
 *
 * Reference: https://wordpress.org/support/topic/errors-parsing-standard-input-code-bitwise-or/
 *
 * The package symfony/polyfill-mbstring most likely comes from the composer package we're using tareq1988/wp-eloquent and
 * this script should be deleted when we remove the tareq1988/wp-eloquent package from this project successfully and migrate
 * to something else.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
	__dirname,
	'..',
	'build',
	'vendor',
	'symfony',
	'polyfill-mbstring',
	'bootstrap80.php'
);

let data = fs.readFileSync(filePath, { encoding: 'utf8' });
data = data.replace(
	/[:]*[\s]*(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)/g,
	''
);
data = data.replace(
	/[:]*[\s]*(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)/g,
	''
);
data = data.replace(
	/[:]*[\s]*(array|string|null|bool|boolean|false|true|int)\|(array|string|null|bool|boolean|false|true|int)/g,
	''
);

console.log('Read php bootstrap80.php file.');

fs.writeFileSync(filePath, data, { encoding: 'utf8' });

console.log('Edited bootstrap80.php file.');
