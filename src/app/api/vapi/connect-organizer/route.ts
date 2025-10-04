import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔗 VAPI Connect Organizer webhook:', body)

    const { reason, urgency = 'medium' } = body.message?.toolCalls?.[0]?.function?.arguments || {}

    // In a real implementation, this would:
    // 1. Find available organizers
    // 2. Create a notification/alert
    // 3. Potentially transfer the call
    // 4. Log the request for follow-up

    console.log(`📞 Connecting caller to organizer - Reason: ${reason}, Urgency: ${urgency}`)

    // Simulate organizer connection
    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            message: `I'm connecting you with an organizer now. They'll be with you shortly to help with: ${reason}. Thanks for your patience!`,
            organizer: {
              name: 'Alex Chen',
              role: 'Event Coordinator',
              status: 'available',
              eta: '2-3 minutes'
            }
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('VAPI Connect Organizer error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to organizer' },
      { status: 500 }
    )
  }
}
