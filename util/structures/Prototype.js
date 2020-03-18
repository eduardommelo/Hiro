Number.prototype.currency = function () {
	return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
Array.prototype.chunk = function(chunkSize) {
	const arr = [];
	for (var i = 0, length = this.length; i < length; i += chunkSize) {
		arr.push(this.slice(i, i + chunkSize));
	}
	return arr;
}
String.prototype.equals = function (another) {
	return another.toLowerCase() === this.toLowerCase();
};