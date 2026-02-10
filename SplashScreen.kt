
package com.arcontrol.arcsl.boot

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun SplashScreen(
    viewModel: SplashViewModel = viewModel(),
    onNavigateDashboard: () -> Unit
) {
    val bootState by viewModel.bootState.collectAsState()
    val alpha = remember { Animatable(1.0f) }

    // This effect triggers the navigation and fade-out animation only when the boot state becomes 'Ready'.
    LaunchedEffect(bootState) {
        if (bootState is BootState.Ready) {
            alpha.animateTo(
                targetValue = 0f,
                animationSpec = tween(durationMillis = 500, easing = LinearEasing)
            )
            onNavigateDashboard()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .alpha(alpha.value)
            .drawWithCache {
                // Cyberpunk radial background glow effect.
                val brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF00202B), Color(0xFF0A0A0B)),
                    center = this.center,
                    radius = size.width / 1.5f
                )
                onDrawBehind {
                    drawRect(brush)
                }
            }
    ) {
        ScanlineEffect()
        
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(modifier = Modifier.weight(1f))
            LogoAndGlow()
            Spacer(modifier = Modifier.weight(1f))
            BootStatus(bootState)
        }
        
        // Footer Credits, as required.
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Desarrollado por ChrisRey91",
                color = Color.White.copy(alpha = 0.3f),
                fontSize = 10.sp,
                letterSpacing = 1.sp
            )
             Text(
                text = "www.arcontrolinteligente.com",
                color = Color.White.copy(alpha = 0.3f),
                fontSize = 10.sp,
                letterSpacing = 1.sp
            )
        }
    }
}

@Composable
private fun LogoAndGlow() {
    val infiniteTransition = rememberInfiniteTransition(label = "logo-glow-transition")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ), label = "logoGlow"
    )

    Box(contentAlignment = Alignment.Center) {
        Canvas(modifier = Modifier.size(160.dp)) {
            drawGlow(glowAlpha)
        }
        Text(
            text = "AR",
            color = Color.White.copy(alpha = 0.9f),
            fontSize = 72.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-8).sp,
        )
    }
    Spacer(modifier = Modifier.height(16.dp))
    Text(
        text = "AR CONTROL LIVE STUDIO",
        color = Color.White.copy(alpha = 0.6f),
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 4.sp
    )
}

@Composable
private fun BootStatus(bootState: BootState) {
    val (progress, phaseMessage) = when(bootState) {
        is BootState.Loading -> bootState.progress to bootState.phase.message
        is BootState.Error -> 1f to bootState.message
        is BootState.Ready -> 1f to "ENGINES READY"
    }
    
    val progressBarBrush = remember {
        Brush.horizontalGradient(colors = listOf(Color(0xFF00E5FF), Color(0xFFBF55EC)))
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AnimatedContent(
            targetState = phaseMessage,
            transitionSpec = { fadeIn(tween(300)) togetherWith fadeOut(tween(300)) },
            label = "status-text-animation"
        ) { text ->
            Text(
                text = text,
                color = if (bootState is BootState.Error) Color(0xFFFF5555) else Color.White.copy(alpha = 0.7f),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.height(16.dp)
            )
        }
        Spacer(modifier = Modifier.height(12.dp))

        // Custom drawn progress bar for glowing effect.
        Canvas(modifier = Modifier.fillMaxWidth().height(4.dp)) {
            // Track
            drawRoundRect(
                color = Color.White.copy(alpha = 0.1f),
                size = size,
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(size.height / 2)
            )
            // Progress Fill with Glow
            drawRoundRect(
                brush = progressBarBrush,
                size = Size(width = size.width * progress, height = size.height),
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(size.height / 2)
            )
        }
        Text(
            text = "${(progress * 100).toInt()}%",
            color = Color.White.copy(alpha = 0.5f),
            fontSize = 10.sp,
            modifier = Modifier.padding(top = 4.dp)
        )
        Spacer(modifier = Modifier.height(32.dp))
    }
}

private fun DrawScope.drawGlow(alpha: Float) {
    val glowBrush = Brush.radialGradient(
        colors = listOf(
            Color(0xFF00E5FF).copy(alpha = 0.5f * alpha),
            Color(0xFFBF55EC).copy(alpha = 0.2f * alpha),
            Color.Transparent
        ),
        radius = size.width / 1.8f
    )
    drawCircle(glowBrush)
}

@Composable
private fun ScanlineEffect() {
    val infiniteTransition = rememberInfiniteTransition(label = "scanline-transition")
    val position by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ), label = "scanline-position"
    )
    
    val lineThicknessPx = with(LocalDensity.current) { 1.dp.toPx() }
    val lineGapPx = with(LocalDensity.current) { 3.dp.toPx() }

    Canvas(modifier = Modifier.fillMaxSize()) {
        val totalLineAndGapHeight = lineThicknessPx + lineGapPx
        val startY = (position * totalLineAndGapHeight * 10) % totalLineAndGapHeight - totalLineAndGapHeight

        var currentY = startY
        while (currentY < size.height) {
            drawLine(
                color = Color.White.copy(alpha = 0.05f),
                start = Offset(0f, currentY),
                end = Offset(size.width, currentY),
                strokeWidth = lineThicknessPx
            )
            currentY += totalLineAndGapHeight
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF0A0A0B)
@Composable
private fun SplashScreenPreview() {
    val mockViewModel = remember {
        object : SplashViewModel() {
            init {
                // Override to prevent coroutine launch in preview
            }
        }
    }
    SplashScreen(viewModel = mockViewModel, onNavigateDashboard = {})
}
