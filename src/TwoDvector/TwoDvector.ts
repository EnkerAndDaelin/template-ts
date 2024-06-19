export class TwoDvector
{
	/**
	 * Constructs a 2D vector
	 * @param x: the x component of the vector
	 * @param y: the y component of the vector
	 */
	constructor(private readonly x: number,
				private readonly y: number)
	{
		// Check x and y components
		if (isNaN(x))
		{
			alert("Invalid x to create 2D vector, switching to 0 by default.");
			this.x = 0;
		}
		if (isNaN(y))
		{
			alert("Invalid y to create 2D vector, switching to 0 by default.");
			this.y = 0;
		}
	}
	
	/**
	 * Gets the vector x component
	 * @returns the x value of the vector
	 */
	public getX(): number
	{
		return this.x;
	}
	
	/**
	 * Gets the vector y component
	 * @returns the y value of the vector
	 */
	public getY(): number
	{
		return this.y;
	}
	
	/**
	 * Gets the vector norm
	 * @returns the norm of the vector
	 */
	public getNorm(): number
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}
