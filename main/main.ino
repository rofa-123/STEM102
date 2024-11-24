#define LED_PIN 25      // GPIO pin connected to Pin 3 (LED)
#define VO_PIN 33       // ADC pin connected to Pin 5 (Vo)
#define BASELINE_VOLTAGE 0.2 // Adjust this value based on your sensor's no-dust output (in volts)

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Turn off the LED initially
  Serial.begin(115200);
}

float getAverageReading(int numSamples) {
  float total = 0.0;
  for (int i = 0; i < numSamples; i++) {
    total += analogRead(VO_PIN);
    delay(10); // Small delay between samples
  }
  return total / numSamples;
}

void loop() {
  // Turn the LED on for sampling
  digitalWrite(LED_PIN, HIGH);
  delayMicroseconds(280); // Stabilization delay for the LED

  // Read and average the ADC values
  float rawValue = getAverageReading(50); // Average 50 samples for smoother data
  digitalWrite(LED_PIN, LOW); // Turn off the LED after sampling

  // Convert raw ADC value to voltage
  float voltage = rawValue * (3.3 / 4095.0); // Adjust for 12-bit ADC and 3.3V reference

  // Calculate dust density
  float dustDensity = (voltage - BASELINE_VOLTAGE) * 1000.0; // Adjust the formula as needed

  // Display results
  Serial.print("Voltage: ");
  Serial.print(voltage, 3); // Show 3 decimal places
  Serial.print(" V, Dust Density: ");
  Serial.print(dustDensity, 2); // Show 2 decimal places
  Serial.println(" ug/m3");
  Serial.print("raw value: ");
  Serial.print(rawValue, 3); // Show 3 decimal places



  delay(1000); // Wait 1 second before the next reading
}
