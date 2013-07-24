/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

/**
 *
 * @author edouard
 */
public class Rectangle extends Shape {
    private float width;
    private float height;

    public Rectangle(float width, float height, float posX, float posY, String color, boolean physics, float density, float restitution, boolean velocity, int xVelocity, int yVelocity, boolean damping, float dampingCoeff, String name, String context) {
        super(posX, posY, color, physics, density, restitution, velocity, xVelocity, yVelocity, damping, dampingCoeff, name, context);
        this.width = width;
        this.height = height;
    }

    
    
    public float getWidth() {
        return width;
    }

    public float getHeight() {
        return height;
    }
    
    
}
