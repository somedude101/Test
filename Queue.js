Queue = function()
{
	var queue  = [];
	var offset = 0;
	this.getLength = function()
	{
		return (queue.length - offset);
	}
	this.isEmpty = function()
	{
		return (queue.length == 0);
	}
	this.enqueue = function(item)
	{
		queue.push(item);
	}
	this.dequeue = function()
	{
		if (queue.length == 0)
			return undefined;
		var item = queue[offset];
		if (++ offset * 2 >= queue.length)
		{
			queue  = queue.slice(offset);
			offset = 0;
		}
		return item;
	}
	this.peek = function()
	{
		return (queue.length > 0 ? queue[offset] : undefined);
	}
	this.get = function(place)
	{
		var item = undefined;
		if (queue.length > 0 && place < (queue.length - offset) && place >= 0)
			item = queue[(offset + place)];
		return item;
	}
}