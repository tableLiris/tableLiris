/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

/**
 *
 * @author edouard
 */
public class Circle extends Shape {
    private float radius;

    public Circle(float radius, float posX, float posY, String color, boolean physics, float density, float restitution, boolean velocity, int xVelocity, int yVelocity, boolean damping, float dampingCoeff, String name, String context) {
        super(posX, posY, color, physics, density, restitution, velocity, xVelocity, yVelocity, damping, dampingCoeff, name, context);
        this.radius = radius;
    }
    
    public float getRadius() {
        return radius;
    }
    
    
}
