let counter = 3;
function incCounter() {
	counter++;
}
module.exports = {
	getCounter: () => counter,
	counter,
	incCounter,
};
