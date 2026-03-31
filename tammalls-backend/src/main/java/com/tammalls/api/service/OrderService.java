package com.tammalls.api.service;

import com.tammalls.api.dto.*;
import com.tammalls.api.entity.*;
import com.tammalls.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductService productService;

    public Order createOrderFromCart(User customer, CreateOrderDto dto) {
        List<CartItem> cartItems = cartItemRepository.findByUser(customer);
        
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal itemTotal = item.getProduct().getDiscountedPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal shippingCost = subtotal.compareTo(BigDecimal.valueOf(50)) > 0 
                ? BigDecimal.ZERO 
                : BigDecimal.valueOf(10);
        
        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(0.05)); // 5% tax
        BigDecimal totalAmount = subtotal.add(shippingCost).add(taxAmount);

        // Create order
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customer(customer)
                .subtotal(subtotal)
                .shippingCost(shippingCost)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(dto.getShippingAddress())
                .phoneNumber(dto.getPhoneNumber())
                .notes(dto.getNotes())
                .build();

        order = orderRepository.save(order);

        // Create order items from cart
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getProduct().getDiscountedPrice())
                    .totalPrice(cartItem.getProduct().getDiscountedPrice()
                            .multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();
            
            orderItemRepository.save(orderItem);

            // Update product quantity
            Product product = cartItem.getProduct();
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Clear cart
        cartItemRepository.deleteByUser(customer);

        return order;
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public Page<Order> getCustomerOrders(User customer, Pageable pageable) {
        return orderRepository.findByCustomer(customer, pageable);
    }

    public Page<Order> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalArgumentException("Can only cancel pending orders");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Restore product quantities
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        for (OrderItem item : orderItems) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }

    public List<OrderItemResponseDto> getOrderItems(Long orderId) {
        Order order = getOrderById(orderId);
        return orderItemRepository.findByOrder(order).stream()
                .map(this::convertOrderItemToDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDto convertToDto(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().toString())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .items(items.stream()
                        .map(this::convertOrderItemToDto)
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponseDto convertOrderItemToDto(OrderItem item) {
        return OrderItemResponseDto.builder()
                .id(item.getId())
                .product(productService.convertToDto(item.getProduct(), userService))
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
