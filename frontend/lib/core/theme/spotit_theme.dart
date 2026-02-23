import 'package:flutter/material.dart';

/// SpotIT application theme configuration.
///
/// Centralised theme so every screen uses the same design tokens.
class SpotITTheme {
  SpotITTheme._();

  // ── Brand colours ──
  static const Color primaryGreen = Color(0xFF4CAF50);
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkAppBar = Color(0xFF1A1A1A);
  static const Color lightBackground = Color(0xFFF5F5F5);

  // ── Light theme ──
  static final ThemeData light = ThemeData(
    brightness: Brightness.light,
    scaffoldBackgroundColor: lightBackground,
    primaryColor: primaryGreen,
    colorScheme: ColorScheme.light(
      primary: primaryGreen,
      secondary: primaryGreen,
      surface: Colors.white,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
      elevation: 0,
    ),
    useMaterial3: true,
  );

  // ── Dark theme ──
  static final ThemeData dark = ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBackground,
    primaryColor: primaryGreen,
    colorScheme: ColorScheme.dark(
      primary: primaryGreen,
      secondary: primaryGreen,
      surface: darkSurface,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: darkAppBar,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    useMaterial3: true,
  );
}
