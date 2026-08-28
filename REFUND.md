# Refund Policy Integration

The application provides a refund request workflow but does not promise automatic refunds for every digital transaction.

Recommended production policy:
1. Validate order ownership.
2. Verify payment settlement/capture.
3. Check provider fulfillment status.
4. Check configured refund rules.
5. Create one active refund request per order.
6. Admin reviews when required.
7. Execute gateway/provider refund only when supported.
8. Record audit/refund events.
9. Expose status to the customer.

Business/legal copy must be customized before publication.
