import 'package:flutter/material.dart';
import 'package:spotit/features/auth/data/services/auth_service.dart';
import 'signup_dialog.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // ─── State ───────────────────────────────────────────────
  UserRole _selectedRole = UserRole.citizen;
  bool _obscurePassword = true;
  bool _isLoading = false;

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // ─── Colors ──────────────────────────────────────────────
  static const Color _green = Color(0xFF2EAA5E);
  static const Color _lightGreen = Color(0xFFE8F5E9);
  static const Color _bgColor = Color(0xFFEEF7EE);
  static const Color _darkYellow = Color(0xFFF5A800);

  // ─── Lifecycle ───────────────────────────────────────────
  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  // ─── Actions ─────────────────────────────────────────────

  Future<void> _handleEmailSignIn() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      await AuthService().signInWithEmail(
        email: _emailController.text.trim(),
        password: _passwordController.text,
        role: _selectedRole,
      );
      if (mounted) {
        _showSnack('Signed in successfully!', isError: false);
        // TODO: Navigate to home screen when ready
        // Navigator.pushReplacementNamed(context, '/home');
      }
    } on Exception catch (e) {
      if (mounted) _showSnack(e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() => _isLoading = true);
    try {
      await AuthService().signInWithGoogle();
      if (mounted) _showSnack('Signed in with Google!', isError: false);
    } on Exception catch (e) {
      if (mounted) _showSnack(e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleForgotPassword() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      _showSnack('Enter your email first.');
      return;
    }
    try {
      await AuthService().sendPasswordResetEmail(email);
      if (mounted) _showSnack('Password reset email sent!', isError: false);
    } on Exception catch (e) {
      if (mounted) _showSnack(e.toString().replaceAll('Exception: ', ''));
    }
  }

  void _openSignUpDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (_) => const SignUpDialog(),
    );
  }

  void _showSnack(String msg, {bool isError = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError ? Colors.redAccent : _green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // ─── Build ───────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _buildCard(),
                ),
              ),
            ),
            _buildDemoNote(),
          ],
        ),
      ),
    );
  }

  // ─── Centered Header ─────────────────────────────────────

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Logo box – dark yellow background with white pin icon
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: _darkYellow,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: _darkYellow.withValues(alpha: 0.35),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(Icons.location_on, color: Colors.white, size: 34),
          ),
          const SizedBox(height: 10),
          const Text(
            'SpotIT LK',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            'Report, Track, Solve',
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey[600],
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Main Card ───────────────────────────────────────────

  Widget _buildCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.07),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Sign in to continue',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 20),

            // ── Role Selector ──
            _buildRoleSelector(),
            const SizedBox(height: 20),

            // ── Official info banner (only when Official is selected) ──
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: _selectedRole == UserRole.official
                  ? Padding(
                      key: const ValueKey('official-banner'),
                      padding: const EdgeInsets.only(bottom: 16),
                      child: _buildOfficialInfoBanner(),
                    )
                  : const SizedBox(key: ValueKey('no-banner'), height: 0),
            ),

            // ── Google Button (Citizen only) ──
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: _selectedRole == UserRole.citizen
                  ? Column(
                      key: const ValueKey('google'),
                      children: [
                        _buildGoogleButton(),
                        const SizedBox(height: 16),
                        _buildDivider(),
                        const SizedBox(height: 16),
                      ],
                    )
                  : const SizedBox(key: ValueKey('no-google'), height: 0),
            ),

            // ── Email Field ──
            _buildLabel('Email'),
            const SizedBox(height: 6),
            _buildEmailField(),
            const SizedBox(height: 14),

            // ── Password Field ──
            _buildLabel('Password'),
            const SizedBox(height: 6),
            _buildPasswordField(),
            const SizedBox(height: 22),

            // ── Sign In Button ──
            _buildSignInButton(),
            const SizedBox(height: 14),

            // ── Forgot Password ──
            Center(
              child: TextButton(
                onPressed: _handleForgotPassword,
                child: const Text(
                  'Forgot password?',
                  style: TextStyle(color: Colors.blueAccent, fontSize: 13),
                ),
              ),
            ),

            // ── Sign Up Link (Citizens only) ──
            _buildSignUpLink(),
          ],
        ),
      ),
    );
  }

  // ─── Role Selector ───────────────────────────────────────

  Widget _buildRoleSelector() {
    return Column(
      children: [
        Text(
          'I am a',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.grey[700],
          ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _roleCard(
                UserRole.citizen,
                Icons.person_outline,
                'Citizen',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _roleCard(
                UserRole.official,
                Icons.shield_outlined,
                'Official',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _roleCard(UserRole role, IconData icon, String label) {
    final isSelected = _selectedRole == role;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedRole = role;
          _emailController.clear();
          _passwordController.clear();
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? _lightGreen : Colors.grey[100],
          border: Border.all(
            color: isSelected ? _green : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, size: 28, color: isSelected ? _green : Colors.grey[500]),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isSelected ? _green : Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Official Info Banner ─────────────────────────────────

  Widget _buildOfficialInfoBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFFFCC02), width: 1.2),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, size: 18, color: Color(0xFFF5A800)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Government officials must log in with their official email credentials.',
              style: TextStyle(
                fontSize: 12.5,
                color: Colors.orange[900],
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Google Button ───────────────────────────────────────

  Widget _buildGoogleButton() {
    return OutlinedButton(
      onPressed: _isLoading ? null : _handleGoogleSignIn,
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 14),
        side: BorderSide(color: _green.withValues(alpha: 0.5)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _GoogleLogo(size: 22),
          SizedBox(width: 10),
          Text(
            'Continue with Google',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Divider ─────────────────────────────────────────────

  Widget _buildDivider() {
    return Row(
      children: [
        Expanded(child: Divider(color: Colors.grey[300])),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'Or continue with email',
            style: TextStyle(color: Colors.grey[500], fontSize: 12),
          ),
        ),
        Expanded(child: Divider(color: Colors.grey[300])),
      ],
    );
  }

  // ─── Form Fields ─────────────────────────────────────────

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        fontSize: 14,
        color: Colors.black87,
      ),
    );
  }

  Widget _buildEmailField() {
    final isOfficial = _selectedRole == UserRole.official;
    return TextFormField(
      controller: _emailController,
      keyboardType: TextInputType.emailAddress,
      decoration: _inputDecoration(
        isOfficial ? 'official@dept.gov.lk' : 'you@example.com',
      ),
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Email is required';
        if (!v.contains('@')) return 'Enter a valid email';
        if (isOfficial && !v.trim().toLowerCase().endsWith('.gov.lk')) {
          return 'Officials must use a .gov.lk email';
        }
        return null;
      },
    );
  }

  Widget _buildPasswordField() {
    return TextFormField(
      controller: _passwordController,
      obscureText: _obscurePassword,
      decoration: _inputDecoration('••••••••').copyWith(
        suffixIcon: IconButton(
          icon: Icon(
            _obscurePassword ? Icons.visibility_off : Icons.visibility,
            color: Colors.grey,
          ),
          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
        ),
      ),
      validator: (v) {
        if (v == null || v.isEmpty) return 'Password is required';
        if (v.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: Colors.grey[400]),
      filled: true,
      fillColor: Colors.grey[100],
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderSide: BorderSide.none,
        borderRadius: BorderRadius.circular(10),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: _green, width: 1.5),
        borderRadius: BorderRadius.circular(10),
      ),
      errorBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        borderRadius: BorderRadius.circular(10),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        borderRadius: BorderRadius.circular(10),
      ),
    );
  }

  // ─── Sign In Button ──────────────────────────────────────

  Widget _buildSignInButton() {
    return SizedBox(
      height: 50,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _handleEmailSignIn,
        style: ElevatedButton.styleFrom(
          backgroundColor: _green,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  color: Colors.white,
                ),
              )
            : const Text(
                'Sign in',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
      ),
    );
  }

  // ─── Sign Up Link ────────────────────────────────────────

  Widget _buildSignUpLink() {
    if (_selectedRole == UserRole.official) return const SizedBox();
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Don't have an account? ",
            style: TextStyle(color: Colors.grey[600], fontSize: 13),
          ),
          GestureDetector(
            onTap: _openSignUpDialog,
            child: const Text(
              'Sign up',
              style: TextStyle(
                color: Colors.blueAccent,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Demo Note ───────────────────────────────────────────

  Widget _buildDemoNote() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.amber[50],
      child: Text(
        'Demo Mode: Click any login button to access the app',
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.orange[800], fontSize: 11),
      ),
    );
  }
}

// ─── Google Logo Widget ──────────────────────────────────────────────────────

class _GoogleLogo extends StatelessWidget {
  final double size;
  const _GoogleLogo({required this.size});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: _GoogleLogoPainter()),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double cx = size.width / 2;
    final double cy = size.height / 2;
    final double r = size.width / 2;

    Paint p(Color color) => Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.18
      ..strokeCap = StrokeCap.butt;

    final rect = Rect.fromCircle(center: Offset(cx, cy), radius: r * 0.75);

    canvas.drawArc(rect, -1.1, 2.25, false, p(const Color(0xFF4285F4)));
    canvas.drawArc(rect, 1.15, 1.65, false, p(const Color(0xFFFBBC05)));
    canvas.drawArc(rect, 2.8, 1.65, false, p(const Color(0xFF34A853)));
    canvas.drawArc(rect, -2.75, 1.65, false, p(const Color(0xFFEA4335)));

    canvas.drawLine(
      Offset(cx, cy),
      Offset(cx + r * 0.75, cy),
      Paint()
        ..color = const Color(0xFF4285F4)
        ..strokeWidth = size.width * 0.18,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
