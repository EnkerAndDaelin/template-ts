import { TwoDvector } from '../TwoDvector/TwoDvector';

export class TwoDmatrix
{
	/*
	Static
	*/
	
	/**
	 * Gets the identity matrix
	 *				1 0 0
	 * @returns I = 0 1 0
	 *				0 0 1
	 */
	public static getIdentity(): TwoDmatrix
	{
		return new TwoDmatrix;
	}
	
	/**
	 * Gets the matrix for specified translation
	 * @param x: the x component (in pixels) of the translation vector
	 * @param y: the y component (in pixels) of the translation vector
	 * @returns the matrix representation of the translation
	 */
	public static getTranslation(x: number, y: number): TwoDmatrix
	{
		const result: TwoDmatrix = new TwoDmatrix;
		result.a[0][2] = x;
		result.a[1][2] = y;
		
		return result;
	}
	
	/**
	 * Gets the matrix for specified circular translation
	 * @param theta: the angle (in degrees) of the circular translation
	 * @param relativeToPoint: the point the ciruclar translation is relative to
	 * @returns the matrix representation of the circular translation
	 */
	public static getCircularTranslation(	theta: number,
											relativeToPoint: TwoDvector): TwoDmatrix
	{
		// Get matrix of full rotation (circular translation + self rotation) first
		const result: TwoDmatrix = TwoDmatrix.getRotation(theta, relativeToPoint);
		
		// Remove self rotation part
		result.a[0][0] = 1;
		result.a[0][1] = 0;
		result.a[1][0] = 0;
		result.a[1][1] = 1;
		
		return result;
	}
	
	/**
	 * Gets the matrix for specified homothety
	 * @param x: the x factor of the homothety
	 * @param y: the y factor of the homothety
	 * @param relativeToPoint: the point the homothety is relative to
	 * @returns the matrix representation of the homothety
	 */
	public static getHomothety(	x: number,
								y: number,
								relativeToPoint: TwoDvector): TwoDmatrix
	{
		const result: TwoDmatrix = new TwoDmatrix;
		result.a[0][0] = x;
		result.a[0][2] = (1 - x) * relativeToPoint.getX();
		result.a[1][1] = y;
		result.a[1][2] = (1 - y) * relativeToPoint.getY();
		
		return result;
	}
	
	/**
	 * Gets the matrix for specified rotation
	 * @param theta: the angle (in degrees) of the rotation
	 * @param relativeToPoint: the point the rotation is relative to
	 * @returns the matrix representation of the rotation
	 */
	public static getRotation(theta: number, relativeToPoint: TwoDvector): TwoDmatrix
	{
		// Convert rotation angle from degrees to radians
		const radianTheta = Math.PI * theta / 180;
		
		const cosTheta = Math.cos(radianTheta);
		const sinTheta = Math.sin(radianTheta);
		
		const result: TwoDmatrix = new TwoDmatrix;
		result.a[0][0] = cosTheta;
		result.a[0][1] = -sinTheta;
		result.a[0][2] = 		(1 - cosTheta) * relativeToPoint.getX()
							+	sinTheta * relativeToPoint.getY();
		result.a[1][0] = sinTheta;
		result.a[1][1] = cosTheta;
		result.a[1][2] = 		(1 - cosTheta) * relativeToPoint.getY()
							-	sinTheta * relativeToPoint.getX();
		return result;
	}
	
	/*
	Instance
	*/
	
	/**
	 * Multiplies the matrix instance by provided one,
	 * this instance being on the left of the * sign 
	 * and the provided one being on the right
	 * @param other: the matrix this instance is multiplied by
	 * @returns the product matrix
	 */
	public multiplyBy(other: TwoDmatrix): TwoDmatrix
	{
		const result: TwoDmatrix = new TwoDmatrix;
		for (let lineIndex = 0; lineIndex < 2; lineIndex++)
		{
			for (let columnIndex = 0; columnIndex < 2; columnIndex++)
			{
				result.a[lineIndex][columnIndex] =
						this.a[lineIndex][0] * other.a[0][columnIndex]
					+	this.a[lineIndex][1] * other.a[1][columnIndex];
			}
			result.a[lineIndex][2] =
						this.a[lineIndex][0] * other.a[0][2]
					+	this.a[lineIndex][1] * other.a[1][2]
					+	this.a[lineIndex][2];
		}
		return result;
	}
	
	/**
	 * Applies the transformation matching the matrix to provided document element
	 * @param documentElement: the document element to apply the matrix transformation to
	 */
	public applyTransformTo(documentElement: HTMLElement): void
	{
		documentElement.style.transform =
			"matrix("	+ this.a[0][0] + ", "
						+ this.a[1][0] + ", "
						+ this.a[0][1] + ", "
						+ this.a[1][1] + ", "
						+ this.a[0][2] + ", "
						+ this.a[1][2] + ")";
	}
	
	// Identity matrix by default
	private readonly a: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	
	/**
	 * Constructs a matrix
	 */
	private constructor()
	{
		
	}
}
