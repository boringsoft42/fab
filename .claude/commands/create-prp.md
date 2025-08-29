```markdown
# 🚀 PRP COMPLETE WORKFLOW

Ejecutar workflow completo de PRP desde creación hasta implementación: **$ARGUMENTS**

## FASE 1: ARQUITECTURA PRP

> **Sub-agente**: prp-architect
>
> **Input**: Descripción de feature: $ARGUMENTS
> **Output**: PRP completo en PRPs/active/
> **Validación**: Confidence score >7/10

## FASE 2: EJECUCIÓN PRP

> **Sub-agente**: prp-executor
>
> **Input**: PRP creado en fase anterior
> **Output**: Implementación completa con tests
> **Validación**: Todas las validation gates pasan

## FASE 3: VALIDACIÓN CALIDAD

> **Sub-agente**: prp-validator
>
> **Input**: Implementación completada
> **Output**: Reporte de validación completo
> **Validación**: Production-ready score >80/100

## ✅ CRITERIOS DE ÉXITO COMPLETO

- [ ] PRP arquitecturado con score >7/10
- [ ] Implementación pasa todas las validations
- [ ] Validation report score >80/100
- [ ] Código listo para producción

**Uso**: `/prp-workflow "implementar autenticación JWT para usuarios YOUTH"`
```
