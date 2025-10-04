import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('💰 VAPI Parse Trade webhook:', body)

    const args = body.message?.toolCalls?.[0]?.function?.arguments || {}
    const { quantity, unit, unit_price, currency, total_value } = args

    console.log('📊 Extracted trade info:', { quantity, unit, unit_price, currency })

    // Calculate total value if not provided
    let calculatedTotal = total_value
    if (quantity && unit_price && !total_value) {
      calculatedTotal = quantity * unit_price
    }

    // Format the trade information for confirmation
    let confirmationMessage = 'Trade information extracted: '
    
    if (quantity && unit) {
      confirmationMessage += `${quantity} ${unit}`
    }
    
    if (unit_price && currency) {
      confirmationMessage += ` at ${unit_price} ${currency} each`
    }
    
    if (calculatedTotal) {
      confirmationMessage += ` (Total: ${calculatedTotal} ${currency})`
    }

    // Store trade information (in real app, save to database)
    const tradeRecord = {
      timestamp: new Date().toISOString(),
      quantity: quantity || 0,
      unit: unit || 'units',
      unit_price: unit_price || 0,
      currency: currency || 'USD',
      total_value: calculatedTotal || 0,
      status: 'extracted'
    }

    console.log('💾 Trade record:', tradeRecord)

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            extracted_info: tradeRecord,
            confirmation: confirmationMessage,
            next_action: 'proceed_with_translation',
            preserved_numbers: {
              quantity,
              unit_price,
              currency,
              total_value: calculatedTotal
            }
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Parse trade webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to parse trade information' },
      { status: 500 }
    )
  }
}
