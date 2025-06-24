import { Dataset } from '@/types/dataset';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, User, HardDrive } from 'lucide-react';

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {dataset.category}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Download className="w-3 h-3" />
            {formatDownloadCount(dataset.downloadCount)}
          </div>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
          {dataset.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{dataset.author}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1 flex flex-col">
        <CardDescription className="text-sm leading-relaxed flex-1 min-h-[4.5rem]">
          {truncateDescription(dataset.description)}
        </CardDescription>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(dataset.datePublished)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <HardDrive className="w-3 h-3" />
            {dataset.size}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
          variant="outline"
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}