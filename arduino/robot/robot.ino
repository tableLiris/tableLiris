// Global declarations
int led = 13;
int enable1 = 2;
int motorpin1 = 3;
int motorpin2 = 4;
int enable2 = 5;
int motorpin3 = 6;
int motorpin4 = 7;
int incomingByte = 0;

// Init function
void setup() {
  Serial.begin(9600);
  pinMode(led,OUTPUT);
  pinMode(enable1,OUTPUT);
  pinMode(enable2,OUTPUT);
  pinMode(motorpin1,OUTPUT);
  pinMode(motorpin2,OUTPUT);
  pinMode(motorpin3,OUTPUT);
  pinMode(motorpin4,OUTPUT);
}

// Loop
void loop() {
  // Turn the leds on
  digitalWrite(led,HIGH);
  
  // If the serial communication is activated
  if (Serial.available() > 0) {
      // Read the incoming byte:
      incomingByte = Serial.read();

      if (incomingByte == 'B') {    // Go backward
        digitalWrite(enable1,HIGH);
        digitalWrite(enable2,HIGH);
        digitalWrite(motorpin1,LOW);
        digitalWrite(motorpin2,HIGH);
        digitalWrite(motorpin3,LOW);
        digitalWrite(motorpin4,HIGH);
      } else if (incomingByte == 'F') { // Go foreward
        digitalWrite(enable1,HIGH);
        digitalWrite(enable2,HIGH);
        digitalWrite(motorpin1,HIGH);
        digitalWrite(motorpin2,LOW);
        digitalWrite(motorpin3,HIGH);
        digitalWrite(motorpin4,LOW);
      } else if (incomingByte == 'L') { // Turn left
        digitalWrite(enable1,HIGH);
        digitalWrite(enable2,HIGH);
        digitalWrite(motorpin2,HIGH);
        digitalWrite(motorpin1,LOW);
        digitalWrite(motorpin3,HIGH);
        digitalWrite(motorpin4,LOW);
      } else if (incomingByte == 'R') { // Turn right
        digitalWrite(enable1,HIGH);
        digitalWrite(enable2,HIGH);
        digitalWrite(motorpin1,HIGH);
        digitalWrite(motorpin2,LOW);
        digitalWrite(motorpin4,HIGH);
        digitalWrite(motorpin3,LOW);
      } else if (incomingByte == 'S') { // Stop
        digitalWrite(enable1,LOW);
        digitalWrite(enable2,LOW);
      }
  }
  
  delay(1);
}
