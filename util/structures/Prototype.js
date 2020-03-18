Number.prototype.currency = function () {
	return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
Array.prototype.chunk = function(chunkSize) {
	const R = [];
	for (let i = 0; i < this.length; i += chunkSize) {
		R.push(this.slice(i, i + chunkSize));
	}
	return R;
}