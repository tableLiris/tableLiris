/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

/**
 *
 * @author edouard
 */
public abstract class Shape {
    private float posX;
    private float posY;
    private String color;
    private boolean physics;
    private float density;
    private float restitution;
    private boolean velocity;
    private int xVelocity;
    private int yVelocity;
    private boolean damping;
    private float dampingCoeff;
    private String name;
    private String context;

    public Shape(float posX, float posY, String color, boolean physics, float density, float restitution, boolean velocity, int xVelocity, int yVelocity, boolean damping, float dampingCoeff, String name, String context) {
        this.posX = posX;
        this.posY = posY;
        this.color = color;
        this.physics = physics;
        this.density = density;
        this.restitution = restitution;
        this.velocity = velocity;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.damping = damping;
        this.dampingCoeff = dampingCoeff;
        this.name = name;
        this.context = context;
    }

    public String getContext() {
        return context;
    }
    
    public float getPosX(){
        return posX;
    }
    
    public float getPosY() {
        return posY;
    }

    public String getColor() {
        return color;
    }

    public boolean isPhysics() {
        return physics;
    }

    public float getDensity() {
        return density;
    }

    public float getRestitution() {
        return restitution;
    }

    public boolean isVelocity() {
        return velocity;
    }

    public int getxVelocity() {
        return xVelocity;
    }

    public int getyVelocity() {
        return yVelocity;
    }

    public boolean isDamping() {
        return damping;
    }

    public float getDampingCoeff() {
        return dampingCoeff;
    }

    public String getName() {
        return name;
    }
}
