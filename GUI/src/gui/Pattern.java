/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

/**
 *
 * @author edouard
 */
public class Pattern {
    private boolean sizeLimited;
    private boolean angleLimited;
    private boolean xLimited;
    private boolean yLimited;
    private int size;
    private int deltaSize;
    private int angle;
    private int deltaAngle;
    private float xMin;
    private float xMax;
    private float yMin;
    private float yMax;
    private boolean gesture;
    private String name;
    private boolean shown;
    private String color;
    private String context;
    private boolean physics;

    public Pattern(boolean sizeLimited, boolean angleLimited, boolean xLimited, boolean yLimited, int size, int deltaSize, int angle, int deltaAngle, float xMin, float xMax, float yMin, float yMax, boolean gesture, String name, boolean shown, String color, String context, boolean physics) {
        this.sizeLimited = sizeLimited;
        this.angleLimited = angleLimited;
        this.xLimited = xLimited;
        this.yLimited = yLimited;
        this.size = size;
        this.deltaSize = deltaSize;
        this.angle = angle;
        this.deltaAngle = deltaAngle;
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.gesture = gesture;
        this.name = name;
        this.shown = shown;
        this.color = color;
        this.context = context;
        this.physics = physics;
    }

    public boolean isShown() {
        return shown;
    }

    public String getColor() {
        return color;
    }

    public String getContext() {
        return context;
    }

    public boolean isPhysics() {
        return physics;
    }

    public String getName() {
        return name;
    }
    
    public boolean isSizeLimited() {
        return sizeLimited;
    }

    public boolean isAngleLimited() {
        return angleLimited;
    }

    public boolean isxLimited() {
        return xLimited;
    }

    public boolean isyLimited() {
        return yLimited;
    }

    public int getSize() {
        return size;
    }

    public int getDeltaSize() {
        return deltaSize;
    }

    public int getAngle() {
        return angle;
    }

    public int getDeltaAngle() {
        return deltaAngle;
    }

    public float getxMin() {
        return xMin;
    }

    public float getxMax() {
        return xMax;
    }

    public float getyMin() {
        return yMin;
    }

    public float getyMax() {
        return yMax;
    }

    public boolean isGesture() {
        return gesture;
    }


}
