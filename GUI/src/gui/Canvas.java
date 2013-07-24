/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

/**
 *
 * @author edouard
 */
public class Canvas {
    private String name;
    private float xPos;
    private float yPos;
    private int zPos;
    private float width;
    private float height;
    private String color;

    public Canvas(String name, float xPos, float yPos, int zPos, float width, float height, String color) {
        this.name = name;
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    public String getColor() {
        return color;
    }
    
    public float getWidth() {
        return width;
    }

    public float getHeight() {
        return height;
    }

    public String getName() {
        return name;
    }

    public float getxPos() {
        return xPos;
    }

    public float getyPos() {
        return yPos;
    }

    public int getzPos() {
        return zPos;
    }
    
}
