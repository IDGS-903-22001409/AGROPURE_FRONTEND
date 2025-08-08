import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductService } from '../../../core/services/product';
import { ReviewService } from '../../../core/services/review';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../core/models/product';
import { Review } from '../../../core/models/review';
import { User } from '../../../core/models/user';
import { RatingDisplayComponent } from '../../../shared/components/rating-display/rating-display';
import { ReviewFormComponent } from '../../../shared/components/review-form/review-form';
import { Observable } from 'rxjs';

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    RatingDisplayComponent,
    ReviewFormComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  productFAQs: FAQ[] = [];
  currentUser$: Observable<User | null>;

  // Estados para el formulario de reseñas
  showReviewForm = false;
  canWriteReview = false;
  hasExistingReview = false;

  // FAQ estáticas por defecto para sistemas de tratamiento de agua
  private defaultFAQs: FAQ[] = [
    {
      question: '¿Qué tipo de mantenimiento requiere el sistema?',
      answer:
        'El sistema requiere mantenimiento preventivo cada 3 meses, que incluye limpieza de sensores, calibración de equipos y revisión de filtros. Nuestro equipo técnico puede realizar este mantenimiento o capacitar a su personal.',
    },
    {
      question: '¿Cuánto tiempo tarda la instalación?',
      answer:
        'La instalación típica toma entre 2 a 4 días laborales, dependiendo de la complejidad del sistema y las condiciones del sitio. Incluye instalación física, configuración de software y capacitación básica.',
    },
    {
      question: '¿El sistema funciona sin conexión a internet?',
      answer:
        'Sí, el sistema puede operar de forma autónoma sin conexión a internet. Sin embargo, para acceder a funciones como monitoreo remoto, alertas móviles y análisis históricos, se requiere conexión a internet.',
    },
    {
      question: '¿Qué parámetros puede monitorear el sistema?',
      answer:
        'El sistema monitorea pH, conductividad eléctrica, turbidez, temperatura, oxígeno disuelto, cloro residual y otros parámetros específicos según la configuración del producto.',
    },
    {
      question: '¿Incluye garantía el equipo?',
      answer:
        'Sí, todos nuestros sistemas incluyen garantía de 24 meses en componentes electrónicos y 12 meses en sensores. También ofrecemos planes de soporte técnico extendido.',
    },
    {
      question: '¿Puedo integrar el sistema con mi infraestructura existente?',
      answer:
        'Sí, nuestros sistemas están diseñados para integrarse con la mayoría de infraestructuras existentes. Nuestro equipo técnico evalúa la compatibilidad durante la fase de cotización.',
    },
    {
      question: '¿Qué capacitación se incluye con la compra?',
      answer:
        'Incluimos capacitación básica de operación (4 horas) y un manual de usuario completo. También ofrecemos capacitación avanzada y certificación de operadores como servicio adicional.',
    },
    {
      question: '¿El sistema puede controlar múltiples puntos de tratamiento?',
      answer:
        'Sí, dependiendo del modelo, un solo sistema puede controlar múltiples puntos de tratamiento y monitoreo. La capacidad varía según la configuración específica del producto.',
    },
  ];

  // FAQ específicas para ciertos tipos de productos
  private productSpecificFAQs: { [key: string]: FAQ[] } = {
    sistema_basico: [
      {
        question: '¿Es adecuado para pequeñas parcelas?',
        answer:
          'Sí, este sistema está diseñado específicamente para parcelas de hasta 5 hectáreas. Es ideal para agricultores que inician en la agricultura de precisión.',
      },
      {
        question: '¿Puedo expandir el sistema más adelante?',
        answer:
          'Absolutamente. El sistema básico está diseñado con arquitectura modular que permite agregar sensores y funcionalidades adicionales conforme crezcan sus necesidades.',
      },
    ],
    sistema_avanzado: [
      {
        question: '¿Incluye análisis predictivo?',
        answer:
          'Sí, el sistema avanzado incluye algoritmos de machine learning que analizan patrones históricos para predecir necesidades de tratamiento y optimizar el uso de recursos.',
      },
      {
        question: '¿Puede manejar múltiples cultivos simultáneamente?',
        answer:
          'Sí, el sistema puede configurarse para manejar diferentes perfiles de calidad de agua según el tipo de cultivo, con parámetros específicos para cada zona.',
      },
    ],
    sistema_industrial: [
      {
        question: '¿Cumple con normativas industriales?',
        answer:
          'Sí, cumple con todas las normativas nacionales e internacionales para sistemas de tratamiento de agua industrial, incluyendo certificaciones ISO y CE.',
      },
      {
        question: '¿Incluye redundancia de sistemas críticos?',
        answer:
          'Sí, incluye respaldo automático en componentes críticos como sensores principales, sistemas de comunicación y fuentes de alimentación.',
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.params['id']);
    if (productId) {
      this.loadProduct(productId);
      this.loadReviews(productId);
      this.checkReviewEligibility(productId);
    } else {
      this.router.navigate(['/products']);
    }
  }

  private loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadFAQs(product);
      },
      error: () => {
        this.router.navigate(['/products']);
      },
    });
  }

  private loadReviews(productId: number): void {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.filter((r) => r.isApproved);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      },
    });
  }

  private checkReviewEligibility(productId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.canWriteReview = false;
      return;
    }

    // Verificar si el usuario ya tiene una reseña para este producto
    this.reviewService.getProductReviews(productId).subscribe({
      next: (allReviews) => {
        // Revisar si ya existe una reseña de este usuario (incluso no aprobada)
        this.hasExistingReview = allReviews.some(
          (review) =>
            review.userName ===
            `${currentUser.firstName} ${currentUser.lastName}`
        );

        // El usuario puede escribir una reseña si:
        // 1. Está autenticado
        // 2. No tiene una reseña existente
        // 3. Es un cliente (los admins pueden escribir reseñas también)
        this.canWriteReview = !this.hasExistingReview;
      },
      error: () => {
        this.canWriteReview = false;
      },
    });
  }

  private loadFAQs(product: Product): void {
    // Comenzar con FAQs por defecto
    this.productFAQs = [...this.defaultFAQs];

    // Agregar FAQs específicas basadas en el nombre o tipo del producto
    const productName = product.name.toLowerCase();
    let specificKey = '';

    if (
      productName.includes('básico') ||
      productName.includes('starter') ||
      productName.includes('pequeño')
    ) {
      specificKey = 'sistema_basico';
    } else if (
      productName.includes('avanzado') ||
      productName.includes('pro') ||
      productName.includes('premium')
    ) {
      specificKey = 'sistema_avanzado';
    } else if (
      productName.includes('industrial') ||
      productName.includes('enterprise') ||
      productName.includes('comercial')
    ) {
      specificKey = 'sistema_industrial';
    }

    // Agregar FAQs específicas al final
    if (specificKey && this.productSpecificFAQs[specificKey]) {
      this.productFAQs = [
        ...this.productFAQs,
        ...this.productSpecificFAQs[specificKey],
      ];
    }

    // FAQ adicional sobre el precio si está disponible
    if (product.basePrice) {
      this.productFAQs.push({
        question: '¿El precio mostrado incluye instalación?',
        answer: `El precio base de $${product.basePrice.toFixed(
          2
        )} incluye el equipo y configuración básica. La instalación, capacitación y puesta en marcha se cotizan por separado según las condiciones específicas del sitio.`,
      });
    }
  }

  // Métodos para manejar las reseñas
  showReviewFormHandler(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      // Redirigir al login si no está autenticado
      this.router.navigate(['/login']);
      return;
    }

    this.showReviewForm = true;
  }

  onReviewSubmitted(): void {
    // Recargar las reseñas y ocultar el formulario
    if (this.product) {
      this.loadReviews(this.product.id);
      this.checkReviewEligibility(this.product.id);
    }
    this.showReviewForm = false;
  }

  onReviewFormCancelled(): void {
    this.showReviewForm = false;
  }

  getUserReviewStatus(): string {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return 'Inicia sesión para escribir una reseña';
    }

    if (this.hasExistingReview) {
      return 'Ya has escrito una reseña para este producto';
    }

    return 'Escribe una reseña';
  }

  getReviewCount(): number {
    return this.reviews.length;
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }
}
