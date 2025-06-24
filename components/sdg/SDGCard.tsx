import { SDGDataset } from '@/types/sdg';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface SDGCardProps {
  sdg: SDGDataset;
}

export function SDGCard({ sdg }: SDGCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white h-full flex flex-col overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={sdg.imageUrl} 
          alt={sdg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-lg font-bold text-primary shadow-lg">
            {sdg.goalNumber}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 backdrop-blur-sm text-primary border-0 shadow-lg">
            <Database className="w-3 h-3 mr-1" />
            {sdg.datasetCount}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
          {sdg.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <p className="text-muted-foreground leading-relaxed">
          {sdg.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
          variant="outline"
          size="lg"
        >
          Explore {sdg.datasetCount} Datasets
        </Button>
      </CardFooter>
    </Card>
  );
}