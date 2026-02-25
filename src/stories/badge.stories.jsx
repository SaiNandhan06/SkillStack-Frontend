// [build] library: 'shadcn'
import { Badge } from "../components/ui/badge";

const meta = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {},
};
export const Secondary = {
  render: (args) => <Badge {...args}>Secondary</Badge>,
  args: {
    variant: "secondary",
  },
};
export const Outline = {
  render: (args) => <Badge {...args}>Outline</Badge>,
  args: {
    variant: "outline",
  },
};
export const Destructive = {
  render: (args) => <Badge {...args}>Destructive</Badge>,
  args: {
    variant: "destructive",
  },
};
