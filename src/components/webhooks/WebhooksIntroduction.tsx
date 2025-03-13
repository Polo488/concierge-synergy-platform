
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function WebhooksIntroduction() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Introduction</h2>
        <p className="text-gray-600 mb-4">
          Webhooks allow your application to receive real-time reservation updates from Hospitable. 
          Instead of constantly polling our API for changes, webhooks push data to your application 
          as soon as something happens.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Common use cases for webhooks include:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Syncing reservation data with external systems</li>
          <li>Triggering automated workflows when a booking is made or modified</li>
          <li>Updating dashboards or reports in real-time</li>
        </ul>
      </div>

      <Button variant="outline" className="mt-4 flex items-center gap-2" asChild>
        <a href="https://developer.hospitable.com/docs/public-api-docs/d862b3ee512e6-introduction#webhooks" target="_blank" rel="noopener noreferrer">
          Learn more
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
